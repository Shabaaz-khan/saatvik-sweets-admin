import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Razorpay keys. The key id is safe to expose to the client; the secret stays server-side.
const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") ?? "";
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function razorpayRequest(path: string, init: RequestInit = {}) {
  const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
  const res = await fetch(`https://api.razorpay.com/v1/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${auth}`,
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

async function verifySignature(body: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(RAZORPAY_KEY_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return expected === razorpay_signature;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "";
    const body = req.method === "POST" ? await req.json() : {};

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return json({ error: "Razorpay keys not configured on the server." }, 500);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // ---- Create Razorpay order + persist a pending order row ----
    if (action === "create-order") {
      const { items, customer, shipping_fee = 0 } = body as {
        items: { product_id: string; name: string; image?: string; price: number; quantity: number }[];
        customer: { name: string; email: string; phone: string; address: string; city?: string; pincode?: string; notes?: string };
        shipping_fee?: number;
      };

      if (!items?.length) return json({ error: "Cart is empty." }, 400);
      if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
        return json({ error: "Missing customer details." }, 400);
      }

      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const total = subtotal + Number(shipping_fee);
      const amountPaise = Math.round(total * 100);

      // Create the Razorpay order
      const rzRes = await razorpayRequest("orders", {
        method: "POST",
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          receipt: `sw_${Date.now()}`,
          notes: { source: "sweet-store" },
        }),
      });
      if (!rzRes.ok) {
        return json({ error: "Razorpay order creation failed", detail: rzRes.data }, 502);
      }
      const rzOrder = rzRes.data as { id: string };

      // Persist a pending order
      const orderNumber = `SW-${Date.now().toString(36).toUpperCase()}`;
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          shipping_address: customer.address,
          city: customer.city,
          pincode: customer.pincode,
          subtotal,
          shipping_fee: Number(shipping_fee),
          total,
          status: "pending",
          payment_status: "unpaid",
          payment_method: "razorpay",
          razorpay_order_id: rzOrder.id,
          notes: customer.notes,
        })
        .select("id")
        .single();

      if (orderErr || !order) {
        return json({ error: "Failed to create order record", detail: orderErr?.message }, 500);
      }

      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.product_id,
        product_name: i.name,
        product_image: i.image,
        price: i.price,
        quantity: i.quantity,
        line_total: i.price * i.quantity,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) {
        return json({ error: "Failed to save order items", detail: itemsErr.message }, 500);
      }

      return json({
        razorpay_order_id: rzOrder.id,
        razorpay_key_id: RAZORPAY_KEY_ID,
        amount: amountPaise,
        currency: "INR",
        order_number: orderNumber,
        internal_order_id: order.id,
      });
    }

    // ---- Verify payment signature + mark order paid ----
    if (action === "verify-payment") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internal_order_id } = body as {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        internal_order_id: string;
      };

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !internal_order_id) {
        return json({ error: "Missing payment verification fields." }, 400);
      }

      const valid = await verifySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
      if (!valid) {
        // mark failed
        await supabase.from("orders").update({ payment_status: "failed" }).eq("id", internal_order_id);
        return json({ error: "Payment signature verification failed." }, 400);
      }

      const { data: updated, error } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "processing",
          razorpay_payment_id,
          razorpay_signature,
        })
        .eq("id", internal_order_id)
        .select("id, order_number, total, customer_name, customer_email, customer_phone, shipping_address, city, pincode")
        .single();

      if (error || !updated) {
        return json({ error: "Payment verified but order update failed.", detail: error?.message }, 500);
      }

      // Fetch items for the success page
      const { data: lineItems } = await supabase
        .from("order_items")
        .select("product_name, product_image, price, quantity, line_total")
        .eq("order_id", internal_order_id);

      return json({
        success: true,
        order: updated,
        items: lineItems ?? [],
        razorpay_payment_id,
      });
    }

    return json({ error: "Unknown action. Use ?action=create-order or ?action=verify-payment." }, 400);
  } catch (err) {
    return json({ error: err.message ?? "Internal server error" }, 500);
  }
});
