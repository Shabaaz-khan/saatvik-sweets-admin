import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  getCategories,
  getOrders,
} from "../api/api";
import { formatINR, formatDate } from '../lib/format';
import { Package, Tags, ShoppingBag, IndianRupee, Clock, ArrowUpRight } from 'lucide-react';
import type { Order,  Product, Category,} from '../lib/types';

export default function DashboardPage() {
    const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, revenue: 0, pending: 0 });
  const [recent, setRecent] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
const [products, categories, orders] = await Promise.all([
  getProducts(),
  getCategories(),
  getOrders(),
]);
const paid = orders.filter(
  (o: Order) => o.paymentStatus === "paid"
);

const revenue = paid.reduce(
  (s: number, o: Order) => s + Number(o.total),
  0
);

const pending = orders.filter(
  (o: Order) =>
    o.status === "pending" ||
    o.status === "processing"
).length;
        setStats({
          products: products.length,
          categories: categories.length,
          orders: orders.length,
          revenue,
          pending,
        });
        setRecent(orders.slice(0, 5));
      } catch (err) {
        // ignore — dashboard just shows zeros
      }
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: 'Total Revenue', value: formatINR(stats.revenue), icon: IndianRupee, tint: 'bg-emerald-50 text-emerald-600', sub: 'from paid orders' },
    { label: 'Total Orders', value: String(stats.orders), icon: ShoppingBag, tint: 'bg-rose-50 text-rose-600', sub: `${stats.pending} pending` },
    { label: 'Products', value: String(stats.products), icon: Package, tint: 'bg-amber-50 text-amber-600', sub: 'in catalog' },
    { label: 'Categories', value: String(stats.categories), icon: Tags, tint: 'bg-sky-50 text-sky-600', sub: 'organized' },
  ];

  if (loading) return <div className="text-stone-400 text-sm">Loading dashboard…</div>;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-semibold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 mt-1">A snapshot of your store today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.tint}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-300" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-stone-900 font-display">{c.value}</div>
                <div className="text-sm text-stone-500 mt-0.5">{c.label}</div>
                <div className="text-xs text-stone-400 mt-1.5">{c.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-semibold text-stone-900">Recent Orders</h2>
            <button onClick={() => navigate("/orders")}className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-sm">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-stone-300" />
              No orders yet. They will appear here once customers check out.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {recent.map((o) => (
                <div key={o._id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-stone-800 text-sm truncate">{o.customerName}</div>
                    <div className="text-xs text-stone-400 truncate">{o.orderNumber} · {formatDate(o.createdAt)}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`badge ${
                      o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                      o.paymentStatus === 'failed' ? 'bg-rose-50 text-rose-700' :
                      'bg-stone-100 text-stone-600'
                    }`}>
                      {o.paymentStatus}
                    </span>
                    <span className="font-semibold text-stone-800 text-sm w-20 text-right">{formatINR(Number(o.total))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display text-xl font-semibold text-stone-900 mb-5">Quick Actions</h2>
          <div className="space-y-3">
            <button onClick={() => navigate("/products")} className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-stone-200 hover:border-rose-200 hover:bg-rose-50/50 transition text-left">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Package className="w-4 h-4" /></div>
              <div>
                <div className="text-sm font-medium text-stone-800">Add a product</div>
                <div className="text-xs text-stone-400">Manage your sweet catalog</div>
              </div>
            </button>
            <button onClick={() => navigate("/categories")} className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-stone-200 hover:border-rose-200 hover:bg-rose-50/50 transition text-left">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Tags className="w-4 h-4" /></div>
              <div>
                <div className="text-sm font-medium text-stone-800">Add a category</div>
                <div className="text-xs text-stone-400">Organize your products</div>
              </div>
            </button>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Clock className="w-4 h-4" /></div>
              <div>
                <div className="text-sm font-medium text-stone-800">{stats.pending} orders need attention</div>
                <div className="text-xs text-stone-400">Pending or processing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
