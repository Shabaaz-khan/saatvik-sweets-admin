import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../lib/config";

import {
  getCorporatePage,
  updateCorporatePage,
} from "../api/api";

import { useToast } from "../lib/toast";

import {
  Loader2,
  Save,
} from "lucide-react";

export default function CorporateCmsPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    heroImage: "",
    eyebrow: "",
    title: "",
    subtitle: "",
    formLabel: "",
    formTitle: "",
    formDescription: "",
  });

  const [features, setFeatures] = useState([
    {
      icon: "Briefcase",
      title: "",
    },
  ]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getCorporatePage();

      setForm({
        heroImage: data.heroImage || "",
        eyebrow: data.eyebrow || "",
        title: data.title || "",
        subtitle: data.subtitle || "",
        formLabel: data.formLabel || "",
        formTitle: data.formTitle || "",
        formDescription: data.formDescription || "",
      });

      setFeatures(data.features || []);
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
      await updateCorporatePage({
        ...form,
        features,
      });

      toast({
        message: "Corporate Page Updated",
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

  const uploadHeroImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);
formData.append("folder", "corporate");
    try {
      const { data } = await axios.post(
        `${API_URL}/api/upload`,
        formData
      );

      setForm({
        ...form,
        heroImage: data.imageUrl,
      });

      toast({
        message: "Hero image uploaded",
        type: "success",
      });
    } catch {
      toast({
        message: "Upload failed",
        type: "error",
      });
    }
  };

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
          Corporate CMS
        </h1>

        <p className="text-stone-500">
          Manage Corporate Page Content
        </p>
      </div>

      <form
        onSubmit={save}
        className="space-y-6"
      >
        {/* Hero */}

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-5">
            Hero Section
          </h2>

          <div className="space-y-5">
            <div>
              <label className="label">
                Hero Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={uploadHeroImage}
              />

              {form.heroImage && (
                <img
                   src={form.heroImage}
                  className="w-72 rounded-xl mt-4"
                />
              )}
            </div>

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
          </div>
        </div>

        {/* Features */}

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-5">
            Features
          </h2>
                    {features.map((item, index) => (
            <div
              key={index}
              className="grid md:grid-cols-[220px_1fr_auto] gap-4 mb-4 items-center"
            >
              <select
                className="input"
                value={item.icon}
                onChange={(e) => {
                  const arr = [...features];
                  arr[index].icon = e.target.value;
                  setFeatures(arr);
                }}
              >
                <option value="Briefcase">Briefcase</option>
                <option value="Package">Package</option>
                <option value="Sparkles">Sparkles</option>
              </select>

              <input
                className="input"
                placeholder="Feature title"
                value={item.title}
                onChange={(e) => {
                  const arr = [...features];
                  arr[index].title = e.target.value;
                  setFeatures(arr);
                }}
              />

              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setFeatures(
                    features.filter((_, i) => i !== index)
                  );
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn-primary mt-2"
            onClick={() =>
              setFeatures([
                ...features,
                {
                  icon: "Briefcase",
                  title: "",
                },
              ])
            }
          >
            + Add Feature
          </button>
        </div>

        {/* Inquiry Form */}

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-5">
            Inquiry Form
          </h2>

          <div className="space-y-5">
            <div>
              <label className="label">
                Small Heading
              </label>

              <input
                className="input"
                value={form.formLabel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    formLabel: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="label">
                Main Heading
              </label>

              <input
                className="input"
                value={form.formTitle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    formTitle: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="label">
                Description
              </label>

              <textarea
                rows={4}
                className="input"
                value={form.formDescription}
                onChange={(e) =>
                  setForm({
                    ...form,
                    formDescription: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Save */}

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