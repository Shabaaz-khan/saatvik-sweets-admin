import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useCart } from '../lib/cart';
import { useToast } from '../lib/toast';
import { formatINR } from '../lib/format';
import { RAZORPAY_ENDPOINT } from '../lib/api';
import type { Product, Category } from '../lib/types';
import {
  Candy, ShoppingBag, Plus, Minus, X, Trash2, Loader2, Star, Search,
  ArrowLeft, CheckCircle2, MapPin, Mail, Phone, Package, ShieldCheck, Truck,
} from 'lucide-react';

type View = 'shop' | 'checkout' | 'success';

type SuccessData = {
  order: {
    id: string;
    order_number: string;
    total: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    city: string | null;
    pincode: string | null;
  };
  items: { product_name: string; product_image: string; price: number; quantity: number; line_total: number }[];
  razorpay_payment_id: string;
};

export default function StorePage({ onGoAdmin }: { onGoAdmin: () => void }) {
  const cart = useCart();
  const toast = useToast();
  const [view, setView] = useState<View>('shop');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [success, setSuccess] = useState<SuccessData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [pr, cr] = await Promise.all([
          api.get<Product[]>('/products?available=true'),
          api.get<Category[]>('/categories?active=true'),
        ]);
        setProducts(pr);
        setCategories(cr);
      } catch (err: any) {
        toast({ message: err.message, type: 'error' });
      }
      setLoading(false);
    })();
  }, []);

  const filtered = products.filter((p) => {
    const q = query.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchC = activeCat === 'all' || p.category === activeCat;
    return matchQ && matchC;
  });

  const featured = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button onClick={() => { setView('shop'); }} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white"><Candy className="w-5 h-5" /></div>
            <span className="font-display text-xl font-semibold text-stone-900">Mithai Mart</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onGoAdmin} className="hidden sm:inline-flex btn-ghost text-sm">Admin</button>
            <button onClick={() => setCartOpen(true)} className="relative btn-secondary">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cart.count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">{cart.count}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {view === 'shop' && (
        <>
          <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-rose-700 to-amber-700 text-white">
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium mb-5">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> Handcrafted fresh daily
                </span>
                <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight">
                  Sweets that make every moment sweeter.
                </h1>
                <p className="mt-5 text-rose-100 text-lg leading-relaxed max-w-xl">
                  Premium traditional Indian mithai, made with pure ghee and the finest ingredients. Delivered to your door.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#shop" className="btn bg-white text-rose-700 hover:bg-rose-50 active:scale-[0.98] shadow-lg">Shop sweets</a>
                  <div className="flex items-center gap-2 text-rose-100 text-sm px-2"><ShieldCheck className="w-4 h-4" /> Secure Razorpay checkout</div>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Truck, title: 'Pan-India delivery', sub: 'Fresh & fast' },
                { icon: ShieldCheck, title: '100% pure ghee', sub: 'No compromises' },
                { icon: Package, title: 'Handcrafted', sub: 'Daily fresh batches' },
                { icon: Star, title: 'Loved by 10k+', sub: 'Happy customers' },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
                    <div>
                      <div className="text-sm font-semibold text-stone-800">{b.title}</div>
                      <div className="text-xs text-stone-400">{b.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {featured.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <h2 className="font-display text-2xl font-semibold text-stone-900 mb-5">Featured sweets</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {featured.map((p) => <ProductCard key={p._id} product={p} onAdd={() => { cart.add(p); toast({ message: `${p.name} added to cart`, type: 'success' }); }} />)}
              </div>
            </section>
          )}

          <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-3xl font-semibold text-stone-900">All sweets</h2>
                <p className="text-stone-500 mt-1">{filtered.length} products</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sweets…" className="input pl-9" />
              </div>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button onClick={() => setActiveCat('all')} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCat === 'all' ? 'bg-rose-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>All</button>
                {categories.map((c) => (
                  <button key={c._id} onClick={() => setActiveCat(c._id)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCat === c._id ? 'bg-rose-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>{c.name}</button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="text-center py-20 text-stone-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <Package className="w-10 h-10 mx-auto mb-3 text-stone-300" />
                <p>No sweets found. Try a different search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {filtered.map((p) => <ProductCard key={p._id} product={p} onAdd={() => { cart.add(p); toast({ message: `${p.name} added to cart`, type: 'success' }); }} />)}
              </div>
            )}
          </section>

          <footer className="border-t border-stone-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-stone-400">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white"><Candy className="w-4 h-4" /></div>
                <span className="font-display font-semibold text-stone-700">Mithai Mart</span>
              </div>
              <p>Made with love &amp; pure ghee. Powered by Razorpay secure payments.</p>
            </div>
          </footer>
        </>
      )}

      {view === 'checkout' && (
        <CheckoutView onBack={() => setView('shop')} onSuccess={(data) => { setSuccess(data); cart.clear(); setView('success'); }} />
      )}

      {view === 'success' && success && (
        <SuccessView data={success} onContinue={() => { setSuccess(null); setView('shop'); }} />
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-in">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-stone-900 flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Your cart</h2>
              <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100"><X className="w-5 h-5" /></button>
            </div>

            {cart.items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-stone-400 p-8">
                <ShoppingBag className="w-12 h-12 mb-3 text-stone-300" />
                <p className="text-sm">Your cart is empty.</p>
                <button onClick={() => setCartOpen(false)} className="btn-secondary mt-4">Browse sweets</button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cart.items.map((it) => (
                    <div key={it.product._id} className="flex gap-3">
                      {it.product.imageUrl ? (
                        <img src={it.product.imageUrl} alt={it.product.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400"><Package className="w-5 h-5" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-800 truncate">{it.product.name}</div>
                        {it.product.weight && <div className="text-xs text-stone-400">{it.product.weight}</div>}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-stone-200 rounded-lg">
                            <button onClick={() => cart.setQuantity(it.product._id, it.quantity - 1)} className="p-1.5 text-stone-500 hover:text-stone-700"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="px-2 text-sm font-medium w-7 text-center">{it.quantity}</span>
                            <button onClick={() => cart.setQuantity(it.product._id, it.quantity + 1)} className="p-1.5 text-stone-500 hover:text-stone-700"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                          <button onClick={() => cart.remove(it.product._id)} className="p-1.5 text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-stone-800 whitespace-nowrap">{formatINR(it.product.price * it.quantity)}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-100 p-5 space-y-3">
                  <div className="flex justify-between text-sm text-stone-500"><span>Subtotal</span><span>{formatINR(cart.subtotal)}</span></div>
                  <div className="flex justify-between text-sm text-stone-500"><span>Shipping</span><span>{cart.subtotal >= 999 ? 'Free' : formatINR(60)}</span></div>
                  <div className="flex justify-between font-semibold text-stone-900 text-base pt-1"><span>Total</span><span>{formatINR(cart.subtotal + (cart.subtotal >= 999 ? 0 : 60))}</span></div>
                  <button onClick={() => { setCartOpen(false); setView('checkout'); }} className="btn-primary w-full">Checkout <ArrowLeft className="w-4 h-4 rotate-180" /></button>
                  {cart.subtotal < 999 && <p className="text-xs text-stone-400 text-center">Add {formatINR(999 - cart.subtotal)} more for free shipping</p>}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <div className="card overflow-hidden group hover:shadow-md transition-all">
      <div className="aspect-square bg-stone-100 overflow-hidden relative">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300"><Candy className="w-10 h-10" /></div>
        )}
        {product.isFeatured && <span className="absolute top-2 left-2 badge bg-amber-400 text-amber-900"><Star className="w-3 h-3 fill-current" /> Featured</span>}
        {Number(product.stock) <= 0 && <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center text-white font-medium text-sm">Out of stock</div>}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-stone-800 leading-snug">{product.name}</h3>
        {product.weight && <p className="text-xs text-stone-400 mt-0.5">{product.weight}</p>}
        <div className="flex items-center justify-between mt-3">
          <span className="font-display text-lg font-semibold text-stone-900">{formatINR(Number(product.price))}</span>
          <button onClick={onAdd} disabled={Number(product.stock) <= 0} className="btn-primary !px-3 !py-2"><Plus className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

function CheckoutView({ onBack, onSuccess }: { onBack: () => void; onSuccess: (d: SuccessData) => void }) {
  const cart = useCart();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const shippingFee = cart.subtotal >= 999 ? 0 : 60;
  const total = cart.subtotal + shippingFee;

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) return;
    setLoading(true);

    try {
      const createRes = await fetch(`${RAZORPAY_ENDPOINT}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items.map((i) => ({
            product_id: i.product._id,
            name: i.product.name,
            image: i.product.imageUrl,
            price: Number(i.product.price),
            quantity: i.quantity,
          })),
          customer: {
            name: form.name, email: form.email, phone: form.phone,
            address: form.address, city: form.city, pincode: form.pincode, notes: form.notes,
          },
          shipping_fee: shippingFee,
        }),
      });
      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(err.error ?? 'Could not start payment. Please try again.');
      }
      const created = await createRes.json();
      if (created.error) throw new Error(created.error);

      await loadRazorpayScript();
      const RZP = (window as any).Razorpay;

      await new Promise<void>((resolve, reject) => {
        const rzp = new RZP({
          key: created.razorpay_key_id,
          amount: created.amount,
          currency: created.currency,
          name: 'Mithai Mart',
          description: 'Sweet order',
          order_id: created.razorpay_order_id,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: '#e11d48' },
          handler: async (response: any) => {
            try {
              const verifyRes = await fetch(`${RAZORPAY_ENDPOINT}/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  internal_order_id: created.internal_order_id,
                }),
              });
              const verified = await verifyRes.json();
              if (!verifyRes.ok || verified.error) throw new Error(verified.error ?? 'Verification failed');
              onSuccess(verified);
              resolve();
            } catch (err: any) {
              toast({ message: err.message ?? 'Payment verification failed', type: 'error' });
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              toast({ message: 'Payment cancelled.', type: 'info' });
              reject(new Error('dismissed'));
            },
          },
        });
        rzp.open();
      });
    } catch (err: any) {
      if (err.message !== 'dismissed') {
        toast({ message: err.message ?? 'Checkout failed', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Package className="w-12 h-12 mx-auto mb-4 text-stone-300" />
        <h2 className="font-display text-2xl font-semibold text-stone-800">Your cart is empty</h2>
        <p className="text-stone-500 mt-2">Add some sweets before checking out.</p>
        <button onClick={onBack} className="btn-primary mt-6">Browse sweets</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <button onClick={onBack} className="btn-ghost mb-6"><ArrowLeft className="w-4 h-4" /> Back to shop</button>
      <h1 className="font-display text-3xl font-semibold text-stone-900 mb-8">Checkout</h1>

      <form onSubmit={pay} className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-5">
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-stone-900 mb-4">Delivery details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="label">Full name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
              <div><label className="label">Phone</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="98XXXXXXXX" /></div>
              <div className="sm:col-span-2"><label className="label">Email</label><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></div>
              <div className="sm:col-span-2"><label className="label">Address</label><textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="input resize-none" /></div>
              <div><label className="label">City</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input" /></div>
              <div><label className="label">Pincode</label><input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="input" /></div>
              <div className="sm:col-span-2"><label className="label">Notes (optional)</label><input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" placeholder="Delivery instructions…" /></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-lg font-semibold text-stone-900 mb-4">Order summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {cart.items.map((it) => (
                <div key={it.product._id} className="flex gap-3 text-sm">
                  {it.product.imageUrl ? <img src={it.product.imageUrl} alt={it.product.name} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-stone-100" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-stone-800 truncate">{it.product.name}</div>
                    <div className="text-xs text-stone-400">{it.quantity} × {formatINR(Number(it.product.price))}</div>
                  </div>
                  <div className="font-medium text-stone-800">{formatINR(it.product.price * it.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>{formatINR(cart.subtotal)}</span></div>
              <div className="flex justify-between text-stone-500"><span>Shipping</span><span>{shippingFee === 0 ? 'Free' : formatINR(shippingFee)}</span></div>
              <div className="flex justify-between font-semibold text-stone-900 text-base pt-1"><span>Total</span><span>{formatINR(total)}</span></div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-5">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Pay {formatINR(total)}
            </button>
            <p className="text-xs text-stone-400 text-center mt-3 flex items-center justify-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Secured by Razorpay</p>
          </div>
        </div>
      </form>
    </div>
  );
}

function SuccessView({ data, onContinue }: { data: SuccessData; onContinue: () => void }) {
  const { order, items, razorpay_payment_id } = data;
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="card p-8 text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-stone-900">Order confirmed!</h1>
        <p className="text-stone-500 mt-2">Thank you, {order.customer_name.split(' ')[0]}. Your sweets are on their way.</p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-stone-50 border border-stone-200 px-4 py-2 text-sm">
          <span className="text-stone-500">Order number:</span>
          <span className="font-semibold text-stone-800">{order.order_number}</span>
        </div>
      </div>

      <div className="card p-6 mt-5">
        <h2 className="font-display text-lg font-semibold text-stone-900 mb-4">Order details</h2>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="flex gap-3 items-center">
              {it.product_image ? <img src={it.product_image} alt={it.product_name} className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-stone-100" />}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-800 truncate">{it.product_name}</div>
                <div className="text-xs text-stone-400">{it.quantity} × {formatINR(Number(it.price))}</div>
              </div>
              <div className="text-sm font-semibold text-stone-800">{formatINR(Number(it.line_total))}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between font-semibold text-stone-900">
          <span>Total paid</span><span>{formatINR(Number(order.total))}</span>
        </div>
      </div>

      <div className="card p-6 mt-5 space-y-3 text-sm">
        <h2 className="font-display text-lg font-semibold text-stone-900 mb-1">Delivery &amp; payment</h2>
        <div className="flex items-start gap-2.5 text-stone-600"><MapPin className="w-4 h-4 text-stone-400 mt-0.5" /> <span>{order.shipping_address}{order.city ? `, ${order.city}` : ''}{order.pincode ? ` — ${order.pincode}` : ''}</span></div>
        <div className="flex items-center gap-2.5 text-stone-600"><Mail className="w-4 h-4 text-stone-400" /> {order.customer_email}</div>
        <div className="flex items-center gap-2.5 text-stone-600"><Phone className="w-4 h-4 text-stone-400" /> {order.customer_phone}</div>
        <div className="flex items-center gap-2.5 text-stone-600"><ShieldCheck className="w-4 h-4 text-stone-400" /> Razorpay payment ID: <span className="font-mono text-xs">{razorpay_payment_id}</span></div>
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={onContinue} className="btn-primary">Continue shopping</button>
      </div>
    </div>
  );
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout.'));
    document.body.appendChild(script);
  });
}
