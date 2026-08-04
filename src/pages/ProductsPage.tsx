import { useEffect, useState } from 'react';
import axios from "axios";
// import { api } from '../lib/api';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getTypes,
} from "../api/api";
import { API_URL } from '../lib/config';
import { useToast } from '../lib/toast';
import { formatINR } from '../lib/format';
import type { Product, Category, Types } from '../lib/types';
import Modal from '../lib/modal';
import { Package, Plus, Pencil, Trash2, Loader2, Search, Star, Check,Upload, X,Image as ImageIcon  } from 'lucide-react';

type FormState = {
  name: string;
  description: string;
  category: string;
  types: string;
  imageUrl: string;
  stock: string;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
badge: string;
  variants: {
    weight: string;
       discount: string;
    price: string;
  }[];
};

const empty: FormState = {
  name: "",
  description: "",
  category: "",
  types: "",
  imageUrl: "",
  stock: "0",
  isAvailable: true,
  isFeatured: false,
  sortOrder: 0,
 badge: "",
  variants: [
    {
      weight: "",
       discount: "",
      price: "",
    },
  ],
};

export default function ProductsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Types[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
const [selectedImage, setSelectedImage] = useState<File | null>(null);

const [preview, setPreview] = useState("");
  const load = async () => {
    setLoading(true);
    try {
const [products, cats, types] = await Promise.all([
  getProducts(),
  getCategories(),
  getTypes(),
]);
console.log("Products API Response:", products);
setRows(products);
setCategories(cats);
setTypes(types);
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

const openNew = () => {

  setEditing(null);

  setForm(empty);

  setSelectedImage(null);

  setPreview("");

  setShowModal(true);

};  
const openEdit = (p: Product) => {
    setEditing(p);
setForm({
  name: p.name,
  description: p.description,
  category: p.category?._id || "",
  types: p.types?._id || "",
  imageUrl: p.imageUrl,
  stock: String(p.stock),
  isAvailable: p.isAvailable,
  isFeatured: p.isFeatured,
  sortOrder: p.sortOrder,
 badge: p.badge || "",
  variants:
    p.variants && p.variants.length > 0
      ? p.variants.map((v) => ({
          weight: v.weight,
           discount: String(v.discount ?? ""),
          price: String(v.price),
        }))
      : [{ weight: "",discount: "", price: "" }],
});
setPreview(p.imageUrl || "");

setSelectedImage(null);
    setShowModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
if (
  !form.name.trim() ||
  form.variants.length === 0 ||
  form.variants.some(v => !v.weight || !v.price)
) {
  return;
}    setSaving(true);
    let imageUrl = form.imageUrl;
    const oldImage = form.imageUrl;
    if (selectedImage) {

    const formData = new FormData();

    formData.append("image", selectedImage);

    formData.append("folder", "products");

    const upload = await axios.post(
    `${API_URL}/api/upload`,
    formData
);

    imageUrl = upload.data.imageUrl;

}
    try {
const payload = {
  name: form.name.trim(),
  description: form.description.trim(),
variants: form.variants.map(v => ({
  weight: v.weight,
   discount: Number(v.discount),
  price: Number(v.price),
})),
  category: form.category || null,
  types: form.types || null,
    badge: form.badge.trim(),
imageUrl,
  stock: Number(form.stock) || 0,
  isAvailable: form.isAvailable,
  isFeatured: form.isFeatured,
  sortOrder: Number(form.sortOrder) || 0,
};
      if (editing) {
        
await updateProduct(editing._id, payload);
         if (
        oldImage &&
        oldImage !== imageUrl
    ) {
        await axios.delete(
            `${API_URL}/api/upload`,
            {
                data: {
                    imageUrl: oldImage,
                },
            }
        );
    }
      } else {
await createProduct(payload);
      }
      toast({ message: editing ? 'Product updated' : 'Product created', type: 'success' });
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

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
if (p.imageUrl) {
  await axios.delete(`${API_URL}/api/upload`, {
    data: {
      imageUrl: p.imageUrl,
    },
  });
}

await deleteProduct(p._id);
 toast({ message: 'Product deleted', type: 'success' });
      load();
    } catch (err: any) {
      toast({ message: err.message, type: 'error' });
    }
  };


  const filtered = rows.filter((r) => {
    const matchQ = r.name.toLowerCase().includes(query.toLowerCase());
    const matchC =
    filterCat === "all" ||
    r.category?._id === filterCat;
    return matchQ && matchC;
  });
const filteredTypes = types.filter(
  (t) => t.category?._id === form.category
);
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
                  <th className="px-5 py-3 font-medium"> Type </th>
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
<img
  src={p.imageUrl}
  alt={p.name}
  className="w-10 h-10 rounded-lg object-cover"
/>
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400"><Package className="w-4 h-4" /></div>
                        )}
                        <div>
                          <div className="font-medium text-stone-800 flex items-center gap-1.5">
                            {p.name}
                            {p.isFeatured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                          </div>
<div className="text-xs text-stone-400">
  {p.variants?.find(v => v.weight === "1kg")?.weight ??
    p.variants?.[0]?.weight ??
    "—"}
</div>                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-stone-500">{p.category?.name || "—"}</td>
                    <td className="px-5 py-3.5 text-stone-500"> {p.types?.name || "—"} </td>
                    <td className="px-5 py-3.5 font-medium text-stone-800">{formatINR(
  Number(
    p.variants?.find(v => v.weight === "1kg")?.price ??
    p.variants?.[0]?.price ??
    0
  )
)}</td>
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
<div className="space-y-3">

  <div className="flex items-center justify-between">
    <label className="label">Weight & Price Variants</label>

    <button
      type="button"
      onClick={() =>
        setForm({
          ...form,
          variants: [
            ...form.variants,
            { weight: "", discount: "",price: "" },
          ],
        })
      }
      className="btn-secondary"
    >
      <Plus className="w-4 h-4" />
      Add Variant
    </button>
  </div>

  {form.variants.map((variant, index) => (
    <div
      key={index}
      className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3"
    >
      <input
        className="input"
        placeholder="250g"
        value={variant.weight}
        onChange={(e) => {
          const variants = [...form.variants];
          variants[index].weight = e.target.value;
          setForm({ ...form, variants });
        }}
      />

{/* Discount */}

<input
  className="input"
  placeholder="Discount"
  type="number"
  value={variant.discount}
  onChange={(e) => {
    const variants = [...form.variants];
    variants[index].discount = e.target.value;
    setForm({ ...form, variants });
  }}
/>

{/* Selling Price */}

<input
  className="input"
  placeholder="Selling Price"
  type="number"
  value={variant.price}
  onChange={(e) => {
    const variants = [...form.variants];
    variants[index].price = e.target.value;
    setForm({ ...form, variants });
  }}
/>
      {form.variants.length > 1 && (
        <button
          type="button"
          onClick={() => {
            const variants = form.variants.filter(
              (_, i) => i !== index
            );

            setForm({
              ...form,
              variants,
            });
          }}
          className="p-3 rounded-lg bg-red-50 text-red-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  ))}

</div>
              <div>
                <label className="label">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, types: "" })} className="input">
                  <option value="">Uncategorized</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
  <label className="label">Type</label>

  <select
    value={form.types}
    onChange={(e) =>
      setForm({
        ...form,
        types: e.target.value,
      })
    }
    className="input"
  >
    <option value="">Select Type</option>

    {filteredTypes.map((t) => (
      <option key={t._id} value={t._id}>
        {t.name}
      </option>
    ))}
  </select>
</div>
<div>
  <label className="label">Product Badge</label>

  <input
    type="text"
    value={form.badge}
    onChange={(e) =>
      setForm({
        ...form,
        badge: e.target.value,
      })
    }
    className="input"
    placeholder="e.g. Bestseller, Signature, New Arrival"
    maxLength={30}
  />

  {/* <p className="mt-1 text-xs text-stone-500">
    Leave empty if you don't want to display a badge.
  </p> */}
</div>
              <div>
                <label className="label">Stock</label>
                <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" />
              </div>
            </div>
<div>
  <label className="label">Product Image</label>

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
          Click to upload product image
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
