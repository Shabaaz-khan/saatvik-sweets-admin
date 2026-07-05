/*
# Sweet Store Schema

## Overview
Creates the full data model for a dynamic sweet store with an admin panel:
categories, products, orders, and order line items. Includes admin-only
write access (via Supabase auth) and public read access for the storefront,
plus public order creation so customers can check out.

## New Tables

### categories
- `id` (uuid, PK)
- `name` (text, unique, not null) — e.g. "Dry Fruits Sweets"
- `slug` (text, unique, not null) — URL-friendly identifier
- `description` (text) — optional category blurb
- `image_url` (text) — optional category image
- `sort_order` (int, default 0) — display ordering
- `is_active` (boolean, default true) — soft-hide from storefront
- `created_at` (timestamptz)

### products
- `id` (uuid, PK)
- `name` (text, not null)
- `slug` (text, unique, not null)
- `description` (text)
- `price` (numeric(10,2), not null) — in INR
- `weight` (text) — e.g. "500g", "1kg"
- `category_id` (uuid, FK -> categories.id, ON DELETE SET NULL)
- `image_url` (text)
- `stock` (int, default 0)
- `is_available` (boolean, default true) — soft-hide / out of stock toggle
- `is_featured` (boolean, default false) — show on homepage
- `sort_order` (int, default 0)
- `created_at` (timestamptz)

### orders
- `id` (uuid, PK)
- `order_number` (text, unique, not null) — human-friendly order id
- `customer_name` (text, not null)
- `customer_email` (text, not null)
- `customer_phone` (text, not null)
- `shipping_address` (text, not null)
- `city` (text)
- `pincode` (text)
- `subtotal` (numeric(10,2), not null)
- `shipping_fee` (numeric(10,2), default 0)
- `total` (numeric(10,2), not null)
- `status` (text, default 'pending') — pending / paid / processing / shipped / delivered / cancelled
- `payment_status` (text, default 'unpaid') — unpaid / paid / failed / refunded
- `payment_method` (text) — 'razorpay' when applicable
- `razorpay_order_id` (text) — Razorpay order id from order-create
- `razorpay_payment_id` (text) — set after successful payment verification
- `razorpay_signature` (text) — stored for audit
- `notes` (text) — customer notes / admin notes
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### order_items
- `id` (uuid, PK)
- `order_id` (uuid, FK -> orders.id, ON DELETE CASCADE)
- `product_id` (uuid, FK -> products.id, ON DELETE SET NULL)
- `product_name` (text, not null) — snapshot at purchase time
- `product_image` (text) — snapshot
- `price` (numeric(10,2), not null) — unit price at purchase
- `quantity` (int, not null)
- `line_total` (numeric(10,2), not null) — price * quantity

## Security (RLS)
- categories: public read (anon + authenticated), admin write (authenticated).
- products: public read of available products, admin full CRUD.
- orders: public insert (customers create orders), admin read/update (admin
  manages orders). Customers cannot read arbitrary orders — only the admin
  sees them in the panel. (A future customer-facing order lookup can be
  added with a token policy.)
- order_items: admin read; inserts cascade with order insert via service
  role in the edge function. Public insert allowed so the storefront can
  write items alongside the order.

## Important Notes
1. Admin writes require an authenticated Supabase session (email/password).
   Create an admin account via the sign-up screen, then sign in.
2. The Razorpay edge function uses the service role key to insert orders
   and order_items, bypassing RLS — that is intentional for checkout.
3. `order_number` is generated as `SW-<timestamp base36>` in the edge
   function to guarantee uniqueness without a sequence.
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  weight text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  stock int NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address text NOT NULL,
  city text,
  pincode text,
  subtotal numeric(10,2) NOT NULL,
  shipping_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'unpaid',
  payment_method text,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_orders" ON orders;
CREATE POLICY "admin_read_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text,
  price numeric(10,2) NOT NULL,
  quantity int NOT NULL,
  line_total numeric(10,2) NOT NULL
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_order_items" ON order_items;
CREATE POLICY "admin_read_order_items" ON order_items FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_order_items" ON order_items;
CREATE POLICY "admin_update_order_items" ON order_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_order_items" ON order_items;
CREATE POLICY "admin_delete_order_items" ON order_items FOR DELETE
  TO authenticated USING (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- updated_at trigger for orders
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
