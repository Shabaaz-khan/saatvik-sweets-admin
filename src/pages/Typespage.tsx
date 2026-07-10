import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useToast } from '../lib/toast';
import type { Types } from "../lib/types";
import Modal from '../lib/modal';
import { Tags, Plus, Pencil, Trash2, X, Loader2, Search } from 'lucide-react';

type FormState = { category: string; name: string; description: string; imageUrl: string; sortOrder: number; isActive: boolean };

const empty: FormState = { category: "", name: '', description: '', imageUrl: '', sortOrder: 0, isActive: true };
export default function TypesPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Types[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Types | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
const [categories, setCategories] = useState([]);

useEffect(() => {
  api.get("/categories").then(setCategories);
}, []);
  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<Category[]>('/types');
      setRows(data);
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setShowModal(true); };

const openEdit = (c: Types) => {
  setEditing(c);

  setForm({
    category: c.category?._id || "",
    name: c.name,
    description: c.description,
    imageUrl: c.imageUrl,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
  });

  setShowModal(true);
};

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        category: form.category,
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      };
      if (editing) {
        await api.put(`/types/${editing._id}`, payload);
      } else {
        await api.post('/types', payload);
      }
      toast({ message: editing ? 'Type updated' : 'Type created', type: 'success' });
      setShowModal(false);
      load();
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
    setSaving(false);
  };

  const remove = async (c: Types) => {
    if (!confirm(`Delete type "${c.name}"?`)) return;
    try {
      await api.del(`/types/${c._id}`);
      toast({ message: 'Type deleted', type: 'success' });
      load();
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
  };

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-900">Types</h1>
          <p className="text-stone-500 mt-1">Manage product types.</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" />New Type</button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-stone-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search categories…" className="input pl-9" />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-stone-400 text-sm"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <Tags className="w-10 h-10 mx-auto mb-3 text-stone-300" />
            <p className="text-sm">{query ? 'No categories match your search.' : 'No categories yet. Create your first one.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-100 bg-stone-50/50">
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-stone-50/60 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={c.name} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400"><Tags className="w-4 h-4" /></div>
                        )}
                        <div>
                          <div className="font-medium text-stone-800">{c.name}</div>
                          <div className="text-xs text-stone-400">
  {c.category?.name}
</div>
                          <div className="text-xs text-stone-400">/{c.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-stone-500 max-w-xs truncate">{c.description || '—'}</td>
                    <td className="px-5 py-3.5 text-stone-500">{c.sortOrder}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                        {c.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => remove(c)} className="p-2 rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
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
        <Modal onClose={() => setShowModal(false)} title={editing ? 'Edit Type' : 'New Type'}>
          <form onSubmit={save} className="space-y-4">
            <div>
  <label className="label">Category</label>

  <select
    value={form.category}
    onChange={(e) =>
      setForm({
        ...form,
        category: e.target.value,
      })
    }
    className="input"
    required
  >
    <option value="">Select Category</option>

    {categories.map((category: any) => (
      <option
        key={category._id}
        value={category._id}
      >
        {category.name}
      </option>
    ))}
  </select>
</div>
            <div>
              <label className="label">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input" placeholder="Dry Fruit Sweets" />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input resize-none" placeholder="A short blurb shown on the storefront" />
            </div>
            <div>
              <label className="label">Image URL</label>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input" placeholder="https://images.pexels.com/..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Sort order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="input" />
              </div>
              <div>
                <label className="label">Status</label>
                <select value={form.isActive ? '1' : '0'} onChange={(e) => setForm({ ...form, isActive: e.target.value === '1' })} className="input">
                  <option value="1">Active</option>
                  <option value="0">Hidden</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editing ? 'Save changes' : 'Create type'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative w-full max-w-lg card p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="font-display text-xl font-semibold text-stone-900">{title}</h2>
//           <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600"><X className="w-5 h-5" /></button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }
