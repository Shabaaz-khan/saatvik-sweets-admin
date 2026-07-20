import { Router } from 'express';
import crypto from 'node:crypto';
import Order from '../models/Order.js';
import Coupon from "../models/Coupon.js";
import { optionalCustomerAuth } from "../middleware/optionalCustomerAuth.js";
const router = Router();

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

async function razorpayRequest(path, init = {}) {
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
  const res = await fetch(`https://api.razorpay.com/v1/${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

function verifySignature(orderId, paymentId, signature) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', KEY_SECRET).update(body).digest('hex');
  return expected === signature;
}

// Create a Razorpay order + persist a pending order in MongoDB
router.post('/create-order',optionalCustomerAuth, async (req, res, next) => {
  try {
    if (!KEY_ID || !KEY_SECRET) return res.status(500).json({ error: 'Razorpay keys not configured on the server.' });

    const { items, customer, shippingFee = 0,  couponCode, couponName, discountType, discountValue, discountAmount = 0, grandTotal, } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'Cart is empty.' });
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      return res.status(400).json({ error: 'Missing customer details.' });
    }

const subtotal = items.reduce(
  (s, i) => s + Number(i.price) * Number(i.quantity),
  0
);

let discount = 0;

if (couponCode) {

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    isActive: true,
  });

  if (coupon) {

    if (coupon.discountType === "percentage") {

      discount =
        subtotal * coupon.discountValue / 100;

      if (
        coupon.maximumDiscount &&
        discount > coupon.maximumDiscount
      ) {
        discount = coupon.maximumDiscount;
      }

    } else {

      discount = coupon.discountValue;

    }

  }

}

const total =
  Number(grandTotal) || subtotal + Number(shippingFee);
    // const total = subtotal + Number(shippingFee);
    const amountPaise = Math.round(total * 100);

    // Create Razorpay order
    const rzRes = await razorpayRequest('orders', {
      method: 'POST',
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        receipt: `sw_${Date.now()}`,
        notes: { source: 'sweet-store' },
      }),
    });
    if (!rzRes.ok) return res.status(502).json({ error: 'Razorpay order creation failed', detail: rzRes.data });
    const rzOrder = rzRes.data;

    // Persist pending order
    const orderNumber = `SW-${Date.now().toString(36).toUpperCase()}`;
    const order = await Order.create({
      orderNumber,
      customer: req.user?._id || null,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: customer.address,
      city: customer.city || '',
      pincode: customer.pincode || '',
      items: items.map((i) => ({
        product: i.product_id || null,
        productName: i.name,
        productImage: i.image || '',
        price: Number(i.price),
        quantity: Number(i.quantity),
        lineTotal: Number(i.price) * Number(i.quantity),
      })),
   subtotal,
discount,
shippingFee: Number(shippingFee),
couponCode: couponCode || "",
couponName: couponName || "",
discountType: discountType || "",
discountValue: Number(discountValue) || 0,
discountAmount: Number(discountAmount) || 0,
total,
couponCode,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: 'razorpay',
      razorpayOrderId: rzOrder.id,
      notes: customer.notes || '',
    });

    res.json({
      razorpay_order_id: rzOrder.id,
      razorpay_key_id: KEY_ID,
      amount: amountPaise,
      currency: 'INR',
      order_number: orderNumber,
      internal_order_id: order._id,
    });
  } catch (err) { next(err); }
});

// Verify Razorpay payment signature + mark order paid
router.post('/verify-payment', async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internal_order_id } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !internal_order_id) {
      return res.status(400).json({ error: 'Missing payment verification fields.' });
    }

    const valid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!valid) {
      await Order.findByIdAndUpdate(internal_order_id, { paymentStatus: 'failed' });
      return res.status(400).json({ error: 'Payment signature verification failed.' });
    }

    const order = await Order.findByIdAndUpdate(
      internal_order_id,
      {
        paymentStatus: 'paid',
        status: 'processing',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: 'Order not found after verification.' });

    res.json({
      success: true,
      order: {
        id: order._id,
        order_number: order.orderNumber,
        total: order.total,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        shipping_address: order.shippingAddress,
        city: order.city,
        pincode: order.pincode,
      },
      items: order.items.map((i) => ({
        product_name: i.productName,
        product_image: i.productImage,
        price: i.price,
        quantity: i.quantity,
        line_total: i.lineTotal,
      })),
      razorpay_payment_id: razorpay_payment_id,
    });
  } catch (err) { next(err); }
});

export default router;
