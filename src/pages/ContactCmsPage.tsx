import { useEffect, useState } from "react";
import { getContactPage, updateContactPage} from "../api/api";
import { useToast } from "../lib/toast";
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  hero: {
    image: "",
    title: "",
    subtitle: "",
  },

  form: {
    label: "",
    title: "",
    description: "",
    image: "",
  },

  contact: {
    companyName: "",
    phone: "",
    whatsapp: "",
    email: "",
    supportEmail: "",
    address: "",
    mapEmbed: "",
  },

  workingHours: {
    mondayFriday: "",
    saturday: "",
    sunday: "",
    holidays: "",
  },

  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    whatsapp: "",
  },
};

export default function ContactCmsPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    const data = await getContactPage();
    setForm(data);
  }

  async function uploadImage(file: File) {
    const body = new FormData();
    body.append("image", file);

    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body,
    });

    const data = await res.json();
    return data.imageUrl;
  }

  async function handleHeroImage(file: File) {
    const image = await uploadImage(file);

    setForm((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        image,
      },
    }));
  }

  async function handleFormImage(file: File) {
    const image = await uploadImage(file);

    setForm((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        image,
      },
    }));
  }

async function save() {
  try {
    setLoading(true);

    await updateContactPage(form);

    toast({
      message: "Contact page updated successfully.",
      type: "success",
    });
  } catch (err: any) {
    toast({
      message:
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update contact page.",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">
        Contact CMS
      </h1>

      {/* HERO */}

      <div className="rounded-xl border p-6 space-y-5">
        <h2 className="text-xl font-semibold">
          Hero Section
        </h2>

        <input
          className="w-full rounded border p-3"
          placeholder="Title"
          value={form.hero.title}
          onChange={(e) =>
            setForm({
              ...form,
              hero: {
                ...form.hero,
                title: e.target.value,
              },
            })
          }
        />

        <textarea
          className="w-full rounded border p-3"
          placeholder="Subtitle"
          rows={3}
          value={form.hero.subtitle}
          onChange={(e) =>
            setForm({
              ...form,
              hero: {
                ...form.hero,
                subtitle: e.target.value,
              },
            })
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.length) {
              handleHeroImage(e.target.files[0]);
            }
          }}
        />

        {form.hero.image && (
          <img
            src={form.hero.image}
            className="h-40 rounded object-cover"
          />
        )}
      </div>

      {/* FORM SECTION */}

      <div className="rounded-xl border p-6 space-y-5">

        <h2 className="text-xl font-semibold">
          Contact Form Section
        </h2>

        <input
          className="w-full rounded border p-3"
          placeholder="Label"
          value={form.form.label}
          onChange={(e) =>
            setForm({
              ...form,
              form: {
                ...form.form,
                label: e.target.value,
              },
            })
          }
        />

        <input
          className="w-full rounded border p-3"
          placeholder="Heading"
          value={form.form.title}
          onChange={(e) =>
            setForm({
              ...form,
              form: {
                ...form.form,
                title: e.target.value,
              },
            })
          }
        />

        <textarea
          className="w-full rounded border p-3"
          rows={4}
          placeholder="Description"
          value={form.form.description}
          onChange={(e) =>
            setForm({
              ...form,
              form: {
                ...form.form,
                description: e.target.value,
              },
            })
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.length) {
              handleFormImage(e.target.files[0]);
            }
          }}
        />

        {form.form.image && (
          <img
            src={form.form.image}
            className="h-40 rounded object-cover"
          />
        )}

      </div>

      {/* CONTACT DETAILS */}

      <div className="rounded-xl border p-6 space-y-4">

        <h2 className="text-xl font-semibold">
          Contact Details
        </h2>

        {[
          ["companyName", "Company Name"],
          ["phone", "Phone"],
          ["whatsapp", "WhatsApp"],
          ["email", "Email"],
          ["supportEmail", "Support Email"],
          ["address", "Address"],
          ["mapEmbed", "Google Map Embed URL"],
        ].map(([key, label]) => (
          <input
            key={key}
            className="w-full rounded border p-3"
            placeholder={label}
            value={(form.contact as any)[key]}
            onChange={(e) =>
              setForm({
                ...form,
                contact: {
                  ...form.contact,
                  [key]: e.target.value,
                },
              })
            }
          />
        ))}

      </div>

      {/* WORKING HOURS */}

      <div className="rounded-xl border p-6 space-y-4">

        <h2 className="text-xl font-semibold">
          Working Hours
        </h2>

        {[
          ["mondayFriday", "Monday - Friday"],
          ["saturday", "Saturday"],
          ["sunday", "Sunday"],
          ["holidays", "Holiday"],
        ].map(([key, label]) => (
          <input
            key={key}
            className="w-full rounded border p-3"
            placeholder={label}
            value={(form.workingHours as any)[key]}
            onChange={(e) =>
              setForm({
                ...form,
                workingHours: {
                  ...form.workingHours,
                  [key]: e.target.value,
                },
              })
            }
          />
        ))}

      </div>

      {/* SOCIAL */}

      <div className="rounded-xl border p-6 space-y-4">

        <h2 className="text-xl font-semibold">
          Social Links
        </h2>

        {[
          ["facebook", "Facebook"],
          ["instagram", "Instagram"],
          ["youtube", "YouTube"],
          ["linkedin", "LinkedIn"],
          ["whatsapp", "WhatsApp"],
        ].map(([key, label]) => (
          <input
            key={key}
            className="w-full rounded border p-3"
            placeholder={label}
            value={(form.social as any)[key]}
            onChange={(e) =>
              setForm({
                ...form,
                social: {
                  ...form.social,
                  [key]: e.target.value,
                },
              })
            }
          />
        ))}

      </div>

<div className="flex justify-end pt-6">
  <button
    type="button"
    onClick={save}
    disabled={loading}
    className="inline-flex items-center rounded-lg bg-rose-600 px-6 py-3 font-medium text-white hover:bg-rose-700 disabled:opacity-50"
  >
    {loading ? "Saving..." : "Save Changes"}
  </button>
</div>
    </div>
  );
}