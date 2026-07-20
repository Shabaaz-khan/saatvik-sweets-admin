import { useEffect, useState } from 'react';
import axios from "axios";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/api";
import { API_URL } from '../lib/config';
import { useToast } from '../lib/toast';
import type { Category } from '../lib/types';
import { Tags, Plus, Pencil, Trash2, X, Loader2, Search,Image as ImageIcon } from 'lucide-react';
import Modal from '../lib/modal';
type FormState = { name: string; description: string; imageUrl: string; sortOrder: number; isActive: boolean };

const empty: FormState = { name: '', description: '', imageUrl: '', sortOrder: 0, isActive: true };

export default function CategoriesPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
const [selectedImage, setSelectedImage] = useState<File | null>(null);

const [preview,setPreview]=useState("");
// const handleImage = (
//     e: React.ChangeEvent<HTMLInputElement>
// ) => {

//     const file = e.target.files?.[0];

//     if (!file) return;

//     setSelectedImage(file);

//     setPreview(URL.createObjectURL(file));

// };
  const load = async () => {
    setLoading(true);
    try {
const data = await getCategories();

setRows(data);
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setShowModal(true);setSelectedImage(null);

setPreview(""); };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description, imageUrl: c.imageUrl, sortOrder: c.sortOrder, isActive: c.isActive });
setPreview(c.imageUrl || "");
    setShowModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      const oldImage = editing?.imageUrl;
      if (selectedImage) {

    const formData = new FormData();

    formData.append("image", selectedImage);

    formData.append("folder", "categories");

    const uploadResponse = await axios.post(
        `${API_URL}/api/upload`,
        formData
        
    );

    imageUrl = uploadResponse.data.imageUrl;

}
const payload = {
  name: form.name.trim(),
  description: form.description.trim(),
  imageUrl: imageUrl, // uploaded image path
  sortOrder: Number(form.sortOrder) || 0,
  isActive: form.isActive,
};
      if (editing) {
       await updateCategory(editing._id, payload);
        if (
  editing &&
  oldImage &&
  oldImage !== imageUrl
) {
  await axios.delete(`${API_URL}/api/upload`, {
    data: {
      imageUrl: oldImage,
    },
  });
}
      } else {
        await createCategory(payload);
      }
      toast({ message: editing ? 'Category updated' : 'Category created', type: 'success' });
      setShowModal(false);
      setSelectedImage(null);
setPreview("");
setForm(empty);
      load();
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
    setSaving(false);
  };

  const remove = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    try {
      await deleteCategory(c._id);
      toast({ message: 'Category deleted', type: 'success' });
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
          <h1 className="font-display text-3xl font-semibold text-stone-900">Categories</h1>
          <p className="text-stone-500 mt-1">Organize your sweets into collections.</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> New category</button>
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
                  <th className="px-5 py-3 font-medium">Category</th>
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
<img
  src={c.imageUrl}
  alt={c.name}
  className="w-10 h-10 rounded-lg object-cover" />                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400"><Tags className="w-4 h-4" /></div>
                        )}
                        <div>
                          <div className="font-medium text-stone-800">{c.name}</div>
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
        <Modal onClose={() => setShowModal(false)} title={editing ? 'Edit category' : 'New category'}>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input" placeholder="Dry Fruit Sweets" />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input resize-none" placeholder="A short blurb shown on the storefront" />
            </div>
  <div>
  <label className="label">Category Image</label>

  <label className="border-2 border-dashed border-stone-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-rose-500 transition">

    {preview ? (
      <img
        src={preview}
        className="w-36 h-36 object-cover rounded-lg"
      />
    ) : (
      <>
        <ImageIcon className="w-10 h-10 text-stone-400 mb-2" />

        <p className="text-sm text-stone-500">
          Click to upload category image
        </p>
      </>
    )}

    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setSelectedImage(file);

        setPreview(URL.createObjectURL(file));
      }}
    />
  </label>

  {preview && (
    <button
      type="button"
      onClick={() => {
        setSelectedImage(null);
        setPreview("");
          setForm({
    ...form,
    imageUrl: "",
  });
      }}
      className="mt-3 text-sm text-red-600"
    >
      Remove Image
    </button>
  )}
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
                {editing ? 'Save changes' : 'Create category'}
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
//     <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-6">
//       <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative mt-10 mb-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-6 overflow-visible animate-scale-in">
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="font-display text-xl font-semibold text-stone-900">{title}</h2>
//           <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600"><X className="w-5 h-5" /></button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }
