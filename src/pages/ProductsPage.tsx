import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useToast } from '../lib/toast';
import { formatINR } from '../lib/format';
import type { Product, Category } from '../lib/types';
import { Modal } from './CategoriesPage';
import { Package, Plus, Pencil, Trash2, Loader2, Search, Star, Check } from 'lucide-react';

type FormState = {
  name: string;
  description: string;
  price: string;
  weight: string;
  category: string;
  imageUrl: string;
  stock: string;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

const empty: FormState = {
  name: '', description: '', price: '', weight: '', category: '', imageUrl: '',
  stock: '0', isAvailable: true, isFeatured: false, sortOrder: 0,
};

export default function ProductsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [products, cats] = await Promise.all([
        api.get<Product[]>('/products'),
        api.get<Category[]>('/categories'),
      ]);
      setRows(products);
      setCategories(cats);
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, price: String(p.price), weight: p.weight,
      category: p.category ?? '', imageUrl: p.imageUrl, stock: String(p.stock),
      isAvailable: p.isAvailable, isFeatured: p.isFeatured, sortOrder: p.sortOrder,
    });
    setShowModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        weight: form.weight.trim(),
        category: form.category || null,
        imageUrl: form.imageUrl.trim(),
        stock: Number(form.stock) || 0,
        isAvailable: form.isAvailable,
        isFeatured: form.isFeatured,
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (editing) {
        await api.put(`/products/${editing._id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      toast({ message: editing ? 'Product updated' : 'Product created', type: 'success' });
      setShowModal(false);
      load();
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
    setSaving(false);
  };

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await api.del(`/products/${p._id}`);
      toast({ message: 'Product deleted', type: 'success' });
      load();
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
  };

  const catName = (id: string | null) => categories.find((c) => c._id === id)?.name ?? '—';

  const filtered = rows.filter((r) => {
    const matchQ = r.name.toLowerCase().includes(query.toLowerCase());
    const matchC = filterCat === 'all' || r.category === filterCat;
    return matchQ && matchC;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-900">Products</h1>
          <p className="text-stone-500 mt-1">Manage your sweet catalog.</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> New product</button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="input pl-9" />
          </div>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input max-w-[200px]">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="p-10 text-center text-stone-400 text-sm"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <Package className="w-10 h-10 mx-auto mb-3 text-stone-300" />
            <p className="text-sm">{query || filterCat !== 'all' ? 'No products match your filters.' : 'No products yet. Add your first sweet.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-100 bg-stone-50/50">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50/60 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-11 h-11 rounded-lg object-cover" />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400"><Package className="w-4 h-4" /></div>
                        )}
                        <div>
                          <div className="font-medium text-stone-800 flex items-center gap-1.5">
                            {p.name}
                            {p.isFeatured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                          </div>
                          {p.weight && <div className="text-xs text-stone-400">{p.weight}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-stone-500">{catName(p.category)}</td>
                    <td className="px-5 py-3.5 font-medium text-stone-800">{formatINR(Number(p.price))}</td>
                    <td className="px-5 py-3.5">
                      <span className={Number(p.stock) <= 5 ? 'text-rose-600 font-medium' : 'text-stone-600'}>{p.stock}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${p.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                        {p.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => remove(p)} className="p-2 rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={editing ? 'Edit product' : 'New product'}>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input" placeholder="Kaju Katli" />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input resize-none" placeholder="Rich cashew-based silver-leafed sweet…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price (₹)</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="input" placeholder="450" />
              </div>
              <div>
                <label className="label">Weight</label>
                <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="input" placeholder="500g" />
              </div>
              <div>
                <label className="label">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                  <option value="">Uncategorized</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Stock</label>
                <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Image URL</label>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input" placeholder="https://images.pexels.com/..." />
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 w-20 h-20 rounded-lg object-cover border border-stone-200" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg border border-stone-200 hover:bg-stone-50">
                <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="w-4 h-4 accent-rose-600" />
                <span className="text-sm font-medium text-stone-700">Available</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg border border-stone-200 hover:bg-stone-50">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-rose-600" />
                <span className="text-sm font-medium text-stone-700">Featured</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editing ? 'Save changes' : 'Create product'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
