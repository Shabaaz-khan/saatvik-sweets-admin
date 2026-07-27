import { useEffect, useState } from 'react';
import {
  getOrders,
  updateOrder,
} from "../api/api";
import { useToast } from '../lib/toast';
import { formatINR, formatDate } from '../lib/format';
import type { Order, OrderStatus } from '../lib/types';
import { ShoppingBag, Search, Loader2, X, Mail, Phone, MapPin, Package, CreditCard, ChevronRight } from 'lucide-react';
import { API_URL } from "../lib/config";
const STATUSES: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusStyle: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700',
  paid: 'bg-emerald-50 text-emerald-700',
  processing: 'bg-sky-50 text-sky-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-rose-50 text-rose-700',
};

export default function OrdersPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
const data = await getOrders();

setRows(data);
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (status: OrderStatus) => {
    if (!selected) return;
    setUpdating(true);
    try {
await updateOrder(selected._id, {
  status,
});
      toast({ message: `Order marked as ${status}`, type: 'success' });
      setSelected({ ...selected, status });
      load();
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
    setUpdating(false);
  };

  const filtered = rows.filter((r) => {
    const q = query.toLowerCase();
    const matchQ = !q || r.orderNumber.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.customerEmail.toLowerCase().includes(q);
    const matchS = filterStatus === 'all' || r.status === filterStatus;
    return matchQ && matchS;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-semibold text-stone-900">Orders</h1>
        <p className="text-stone-500 mt-1">Track and manage customer orders.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by order #, name, email…" className="input pl-9" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input max-w-[180px]">
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="p-10 text-center text-stone-400 text-sm"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-stone-300" />
            <p className="text-sm">{query || filterStatus !== 'all' ? 'No orders match your filters.' : 'No orders yet. They appear here after checkout.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-100 bg-stone-50/50">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((o) => (
                  <tr key={o._id} onClick={() => setSelected(o)} className="hover:bg-stone-50/60 transition cursor-pointer">
                    <td className="px-5 py-3.5"><div className="font-medium text-stone-800">{o.orderNumber}</div></td>
                    <td className="px-5 py-3.5">
                      <div className="text-stone-800">{o.customerName}</div>
                      <div className="text-xs text-stone-400">{o.customerEmail}</div>
                    </td>
                    <td className="px-5 py-3.5 text-stone-500 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : o.paymentStatus === 'failed' ? 'bg-rose-50 text-rose-700' : 'bg-stone-100 text-stone-600'}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><span className={`badge ${statusStyle[o.status]}`}>{o.status}</span></td>
                    <td className="px-5 py-3.5 font-semibold text-stone-800">{formatINR(Number(o.total))}</td>
                    <td className="px-5 py-3.5 text-stone-400"><ChevronRight className="w-4 h-4" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setSelected(null)} />
          <div className="relative h-full w-full max-w-xl bg-white shadow-2xl overflow-y-auto bg-white shadow-2xl h-full overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-stone-900">{selected.orderNumber}</h2>
                <p className="text-xs text-stone-400">{formatDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className={`badge ${statusStyle[selected.status]}`}>{selected.status}</span>
                <span className={`badge ${selected.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : selected.paymentStatus === 'failed' ? 'bg-rose-50 text-rose-700' : 'bg-stone-100 text-stone-600'}`}>
                  Payment: {selected.paymentStatus}
                </span>
                {selected.paymentMethod && <span className="badge bg-stone-100 text-stone-600">{selected.paymentMethod}</span>}
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Customer</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2.5 text-stone-700"><Package className="w-4 h-4 text-stone-400" /> {selected.customerName}</div>
                  <div className="flex items-center gap-2.5 text-stone-700"><Mail className="w-4 h-4 text-stone-400" /> {selected.customerEmail}</div>
                  <div className="flex items-center gap-2.5 text-stone-700"><Phone className="w-4 h-4 text-stone-400" /> {selected.customerPhone}</div>
<div className="flex items-start gap-2.5 text-stone-700">
  <MapPin className="w-4 h-4 text-stone-400 mt-1 flex-shrink-0" />

  <div className="space-y-1">
    <div className="font-medium">
      {selected.firstName} {selected.lastName}
    </div>

    <div>{selected.address1}</div>

    {selected.address2 && (
      <div>{selected.address2}</div>
    )}

    {selected.landmark && (
      <div>Landmark: {selected.landmark}</div>
    )}

    <div>
      {selected.city}, {selected.state} - {selected.pincode}
    </div>
  </div>
</div>                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Items</h3>
                <div className="space-y-3">
                  {selected.items.map((it) => (
                    <div key={it._id} className="flex items-center gap-3">
                      {it.productImage ? (
                <img src={it.productImage} alt={it.productName} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (

                        <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400"><Package className="w-4 h-4" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-800 truncate">{it.productName}</div>
                        <div className="text-xs text-stone-400">{formatINR(Number(it.price))} × {it.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold text-stone-800">{formatINR(Number(it.lineTotal))}</div>
                    </div>
                  ))}
                </div>
              </div>
<div className="border-t border-stone-100 pt-4 space-y-3 text-sm">

  <div className="flex justify-between text-stone-500">
    <span>Subtotal</span>

    <span>
      {formatINR(Number(selected.subtotal))}
    </span>
  </div>

  <div className="flex justify-between text-stone-500">
    <span>Shipping</span>

    <span>
      {formatINR(Number(selected.shippingFee))}
    </span>
  </div>

  {Number(selected.discountAmount) > 0 && (
    <div className="flex justify-between text-emerald-600 font-medium">

      <span>Coupon Discount</span>

      <span>
        -{formatINR(Number(selected.discountAmount))}
      </span>

    </div>
  )}

  <div className="border-t pt-3 flex justify-between text-base font-semibold">

    <span>Total Paid</span>

    <span>
      {formatINR(Number(selected.total))}
    </span>

  </div>

</div>

              {selected.razorpayPaymentId && (
                <div className="rounded-lg bg-stone-50 border border-stone-100 p-3 text-xs text-stone-500 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-600 font-medium"><CreditCard className="w-3.5 h-3.5" /> Razorpay</div>
                  <div>Payment ID: {selected.razorpayPaymentId}</div>
                  <div>Order ID: {selected.razorpayOrderId}</div>
                </div>
              )}

              {selected.notes && (
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-sm text-amber-800">
                  <span className="font-medium">Note: </span>{selected.notes}
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Update status</h3>
                <div className="grid grid-cols-3 gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(s)}
                      disabled={updating || selected.status === s}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition capitalize ${
                        selected.status === s ? 'bg-rose-600 text-white border-rose-600' : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
