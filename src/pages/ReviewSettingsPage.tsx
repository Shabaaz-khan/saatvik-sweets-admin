import { useEffect, useState } from "react";
import { Loader2, Save, Upload } from "lucide-react";

import {
  getReviewSettings,
  updateReviewSettings,
} from "../api/api";

import { useToast } from "../lib/toast";

type FormState = {
  heading: string;

  subHeading: string;

  centerImage: string;

  averageRating: string;

  totalCustomers: string;

  totalProducts: string;

  purityPercentage: string;

  autoSlide: boolean;

  slideDuration: number;

  showStats: boolean;
};

const empty: FormState = {
  heading: "",

  subHeading: "",

  centerImage: "",

  averageRating: "4.9",

  totalCustomers: "10000+",

  totalProducts: "50+",

  purityPercentage: "100%",

  autoSlide: true,

  slideDuration: 5000,

  showStats: true,
};

export default function ReviewSettingsPage() {

  const toast = useToast();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] =
    useState<FormState>(empty);

  useEffect(() => {
    load();
  }, []);

  async function load() {

    setLoading(true);

    try {

      const data =
        await getReviewSettings();

      setForm({
        heading: data.heading,

        subHeading: data.subHeading,

        centerImage: data.centerImage,

        averageRating:
          data.averageRating,

        totalCustomers:
          data.totalCustomers,

        totalProducts:
          data.totalProducts,

        purityPercentage:
          data.purityPercentage,

        autoSlide: data.autoSlide,

        slideDuration:
          data.slideDuration,

        showStats:
          data.showStats,
      });

    } catch (err: any) {

      toast({
        message: err.message,
        type: "error",
      });

    }

    setLoading(false);

  }

  async function save() {

    setSaving(true);

    try {

      await updateReviewSettings(form);

      toast({
        message:
          "Review Settings Updated",
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
      <div className="py-20 flex justify-center">

        <Loader2 className="animate-spin" />

      </div>
    );

  }

  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Review Settings

          </h1>

          <p className="text-stone-500 mt-1">

            Manage review section.

          </p>

        </div>

        <button
          onClick={save}
          disabled={saving}
          className="btn-primary"
        >

          {saving && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}

          <Save className="w-4 h-4" />

          Save

        </button>

      </div>

      <div className="card p-6 space-y-6">
        <div>

  <label className="label">
    Heading
  </label>

  <input
    className="input"
    value={form.heading}
    onChange={(e) =>
      setForm({
        ...form,
        heading: e.target.value,
      })
    }
  />

</div>

<div>

  <label className="label">
    Sub Heading
  </label>

  <textarea
    className="input h-24"
    value={form.subHeading}
    onChange={(e) =>
      setForm({
        ...form,
        subHeading: e.target.value,
      })
    }
  />

</div>

<div>

  <label className="label">
    Center Image
  </label>

  <input
    type="file"
    className="input"
    accept="image/*"
    onChange={async (e) => {

      const file = e.target.files?.[0];

      if (!file) return;

      const formData = new FormData();

      formData.append("image", file);

      formData.append(
        "folder",
        "review-settings"
      );

      try {

        const res = await fetch(
          "http://localhost:5000/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        setForm({
          ...form,
          centerImage: data.imageUrl,
        });

        toast({
          message:
            "Image Uploaded",
          type: "success",
        });

      } catch (err: any) {

        toast({
          message: err.message,
          type: "error",
        });

      }

    }}
  />

  {form.centerImage && (

    <img
      src={form.centerImage}
      className="mt-4 h-40 rounded-lg border object-contain"
    />

  )}

</div>

<div className="grid grid-cols-2 gap-4">

  <div>

    <label className="label">
      Average Rating
    </label>

    <input
      className="input"
      value={form.averageRating}
      onChange={(e) =>
        setForm({
          ...form,
          averageRating:
            e.target.value,
        })
      }
    />

  </div>

  <div>

    <label className="label">
      Happy Customers
    </label>

    <input
      className="input"
      value={form.totalCustomers}
      onChange={(e) =>
        setForm({
          ...form,
          totalCustomers:
            e.target.value,
        })
      }
    />

  </div>

  <div>

    <label className="label">
      Products Count
    </label>

    <input
      className="input"
      value={form.totalProducts}
      onChange={(e) =>
        setForm({
          ...form,
          totalProducts:
            e.target.value,
        })
      }
    />

  </div>

  <div>

    <label className="label">
      Purity %
    </label>

    <input
      className="input"
      value={form.purityPercentage}
      onChange={(e) =>
        setForm({
          ...form,
          purityPercentage:
            e.target.value,
        })
      }
    />

  </div>

</div>

<div className="grid grid-cols-2 gap-6">

  <label className="flex items-center gap-3">

    <input
      type="checkbox"
      checked={form.autoSlide}
      onChange={(e) =>
        setForm({
          ...form,
          autoSlide:
            e.target.checked,
        })
      }
    />

    Auto Slide

  </label>

  <label className="flex items-center gap-3">

    <input
      type="checkbox"
      checked={form.showStats}
      onChange={(e) =>
        setForm({
          ...form,
          showStats:
            e.target.checked,
        })
      }
    />

    Show Statistics

  </label>

</div>

<div>

  <label className="label">
    Slide Duration (ms)
  </label>

  <input
    type="number"
    className="input"
    value={form.slideDuration}
    onChange={(e) =>
      setForm({
        ...form,
        slideDuration:
          Number(
            e.target.value
          ),
      })
    }
  />

</div>

</div>

</div>
);
}
     