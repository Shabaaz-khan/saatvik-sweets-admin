import { useEffect, useState } from "react";

import {
  getMenuPage,
  updateMenuPage,
   getProducts,
} from "../api/api";

import { useToast } from "../lib/toast";

import {
  Loader2,
  Save,
} from "lucide-react";

export default function MenuCmsPage() {

  const toast = useToast();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    eyebrow: "",
    title: "",
    subtitle: "",
    allTabName: "",
  });
  const [showProducts, setShowProducts] = useState(false);
const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  useEffect(() => {
    load();
  }, []);

  async function load() {

    try {

const [data, productList] = await Promise.all([
  getMenuPage(),
  getProducts(),
]);
      setForm({

        eyebrow: data.eyebrow || "",

        title: data.title || "",

        subtitle: data.subtitle || "",

        allTabName: data.allTabName || "",

      });
setProducts(productList);

setSelectedProducts(
  data.firstTabProducts?.map((p: any) => p._id) || []
);
    } catch (err: any) {

      toast({

        message: err.message,

        type: "error",

      });

    }

    setLoading(false);

  }

  async function save(e: React.FormEvent) {

    e.preventDefault();

    setSaving(true);

    try {

await updateMenuPage({
  ...form,
  firstTabProducts: selectedProducts,
});
      toast({

        message: "Menu Page Updated",

        type: "success",

      });

    } catch (err: any) {

      toast({

        message: err.message,

        type: "error",

      });

    }

    setSaving(false);

  }

  if (loading) {

    return (

      <div className="p-10 text-center">

        <Loader2 className="animate-spin mx-auto" />

      </div>

    );

  }
  return (
  <div className="space-y-6 animate-fade-up">

    <div>
      <h1 className="font-display text-3xl font-semibold">
        Menu CMS
      </h1>

      <p className="text-stone-500">
        Manage Menu Page Content
      </p>
    </div>

    <form
      onSubmit={save}
      className="space-y-6"
    >

      <div className="card p-6">

        <h2 className="text-lg font-semibold mb-5">
          Menu Hero
        </h2>

        <div className="space-y-5">

          <div>

            <label className="label">
              Eyebrow
            </label>

            <input
              className="input"
              value={form.eyebrow}
              onChange={(e) =>
                setForm({
                  ...form,
                  eyebrow: e.target.value,
                })
              }
            />

          </div>

          <div>

            <label className="label">
              Title
            </label>

            <input
              className="input"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

          </div>

          <div>

            <label className="label">
              Subtitle
            </label>

            <textarea
              rows={4}
              className="input"
              value={form.subtitle}
              onChange={(e) =>
                setForm({
                  ...form,
                  subtitle: e.target.value,
                })
              }
            />

          </div>

          <div>

            <label className="label">
              First Tab Name
            </label>

            <input
              className="input"
              placeholder="Everything"
              value={form.allTabName}
              onChange={(e) =>
                setForm({
                  ...form,
                  allTabName: e.target.value,
                })
              }
            />

            <p className="text-xs text-stone-400 mt-2">
              Only the first tab name will change. Category names will remain unchanged.
            </p>

          </div>

        </div>

      </div>
<div className="card p-6">

  <h2 className="text-lg font-semibold mb-5">
    Products for "{form.allTabName || "First Tab"}"
  </h2>

  <button
    type="button"
    onClick={() => setShowProducts(!showProducts)}
    className="input flex justify-between items-center"
  >
    <span>Select Products</span>

    <span>{showProducts ? "▲" : "▼"}</span>
  </button>

  {showProducts && (

    <div className="mt-4 border rounded-xl max-h-80 overflow-y-auto">

      {products.map((product) => (

        <label
          key={product._id}
          className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 border-b last:border-b-0"
        >

          <input
            type="checkbox"
            checked={selectedProducts.includes(product._id)}
            onChange={(e) => {

              if (e.target.checked) {

                setSelectedProducts([
                  ...selectedProducts,
                  product._id,
                ]);

              } else {

                setSelectedProducts(
                  selectedProducts.filter(
                    id => id !== product._id
                  )
                );

              }

            }}
          />

          <span>{product.name}</span>

        </label>

      ))}

    </div>

  )}

</div>
{selectedProducts.length > 0 && (

<div className="mt-5">

  <p className="text-sm font-medium mb-3">
    Selected Products
  </p>

  <div className="flex flex-wrap gap-2">

    {selectedProducts.map((id) => {

      const product = products.find(
        p => p._id === id
      );

      if (!product) return null;

      return (

        <div
          key={id}
          className="bg-rose-50 text-rose-700 rounded-full px-4 py-2 flex items-center gap-2"
        >

          {product.name}

          <button
            type="button"
            onClick={() => {

              setSelectedProducts(
                selectedProducts.filter(
                  x => x !== id
                )
              );

            }}
          >
            ✕

          </button>

        </div>

      );

    })}

  </div>

</div>

)}
      <div className="flex justify-end">

        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
        >

          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          )}

        </button>

      </div>

    </form>

  </div>
);
}