import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  Star,
} from "lucide-react";

import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../api/api";

import Modal from "../lib/modal";
import { useToast } from "../lib/toast";
import type { Review } from "../lib/types";

type FormState = {
  customerName: string;
  customerImage: string;

  platformName: string;
  platformLogo: string;

  rating: number;

  review: string;

  reviewDate: string;
  displayOrder: string;
  isActive: boolean;
};

const empty: FormState = {
  customerName: "",
  customerImage: "",

  platformName: "",
  platformLogo: "",

  rating: 5,

  review: "",

  reviewDate: new Date().toISOString().substring(0, 10),

  displayOrder: "1",

  isActive: true,
};

export default function ReviewsPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [rows, setRows] = useState<Review[]>([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editing, setEditing] =
    useState<Review | null>(null);

  const [form, setForm] =
    useState<FormState>(empty);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {
      const data = await getReviews();

      console.log("Reviews API:", data);

      setRows(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({
        message: err.message,
        type: "error",
      });
    }

    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm(empty);
    setShowModal(true);
  }

  function openEdit(review: Review) {
    setEditing(review);

    setForm({
      customerName: review.customerName,
      customerImage: review.customerImage,
      platformName: review.platformName,
platformLogo: review.platformLogo,

      rating: review.rating,
      review: review.review,
      reviewDate: review.reviewDate.substring(0, 10),
      displayOrder: String(review.displayOrder),
      isActive: review.isActive,
    });

    setShowModal(true);
  }

  async function save(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);

    try {
      const payload = {
        customerName: form.customerName,
        customerImage: form.customerImage,
        platformName: form.platformName,
platformLogo: form.platformLogo,

        rating: Number(form.rating),
        review: form.review,
        reviewDate: form.reviewDate,
        displayOrder: Number(form.displayOrder),
        isActive: form.isActive,
      };

      if (editing) {
        await updateReview(
          editing._id,
          payload
        );
      } else {
        await createReview(payload);
      }

      toast({
        message: editing
          ? "Review Updated"
          : "Review Created",
        type: "success",
      });

      setShowModal(false);

      setForm(empty);

      load();
    } catch (err: any) {
      toast({
        message: err.message,
        type: "error",
      });
    }

    setSaving(false);
  }

  async function remove(review: Review) {
    if (
      !confirm(
        `Delete review from ${review.customerName}?`
      )
    )
      return;

    try {
      await deleteReview(review._id);

      toast({
        message: "Review Deleted",
        type: "success",
      });

      load();
    } catch (err: any) {
      toast({
        message: err.message,
        type: "error",
      });
    }
  }

  const filtered = useMemo(() => {
    return rows.filter(
      (x) =>
        x.customerName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        x.platform
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [rows, search]);

  return (
    <div className="space-y-6">
              <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-stone-900">
            Reviews
          </h1>

          <p className="text-stone-500 mt-1">
            Create and manage customer reviews.
          </p>
        </div>

        <button
          onClick={openNew}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>

      </div>

      <div className="relative">

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search reviews..."
          className="input pl-10"
        />

      </div>

      <div className="card overflow-hidden">

        {loading ? (

          <div className="py-20 flex justify-center">

            <Loader2 className="animate-spin" />

          </div>

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left p-4">
                  Customer
                </th>

                <th className="text-left p-4">
                  Platform
                </th>

                <th className="text-left p-4">
                  Rating
                </th>

                <th className="text-left p-4">
                  Order
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-right p-4">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((review) => (

                <tr
                  key={review._id}
                  className="border-b"
                >

                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <img
                        src={review.customerImage}
                        alt={review.customerName}
                        className="w-12 h-12 rounded-full object-cover border"
                      />

                      <div>

                        <p className="font-semibold">
                          {review.customerName}
                        </p>

                        <p className="text-xs text-stone-500">
                          {new Date(
                            review.reviewDate
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="p-4 capitalize">

                  <div className="flex items-center gap-3">

  <img
    src={review.platformLogo}
    className="h-8 w-8 object-contain"
    alt=""
  />

  <span>

    {review.platformName}

  </span>

</div>

                  </td>

                  <td className="p-4">

                    <div className="flex items-center gap-1">

                      {Array.from({
                        length: review.rating,
                      }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}

                    </div>

                  </td>

                  <td className="p-4">

                    {review.displayOrder}

                  </td>

                  <td className="p-4">

                    {review.isActive ? (

                      <span className="badge-success">
                        Active
                      </span>

                    ) : (

                      <span className="badge-danger">
                        Inactive
                      </span>

                    )}

                  </td>

                  <td className="p-4">

                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() =>
                          openEdit(review)
                        }
                        className="btn-secondary"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          remove(review)
                        }
                        className="btn-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>
            {showModal && (
        <Modal
          title={
            editing
              ? "Edit Review"
              : "New Review"
          }
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="review-form"
                disabled={saving}
                className="btn-primary"
              >
                {saving && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}

                {editing
                  ? "Update Review"
                  : "Save Review"}
              </button>
            </>
          }
        >
          <form
            id="review-form"
            onSubmit={save}
            className="space-y-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Star className="text-yellow-500" />

              <h2 className="text-xl font-semibold">
                {editing
                  ? "Edit Review"
                  : "New Review"}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="label">
                  Customer Name
                </label>

                <input
                  className="input"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customerName:
                        e.target.value,
                    })
                  }
                />
              </div>

   <div>
  <label className="label">
    Platform Name
  </label>

  <input
    className="input"
    placeholder="Google, Swiggy, Zomato..."
    value={form.platformName}
    onChange={(e) =>
      setForm({
        ...form,
        platformName: e.target.value,
      })
    }
  />
</div>

      <div>
  <label className="label">
    Customer Image
  </label>

  <input
    type="file"
    accept="image/*"
    className="input"
    onChange={async (e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const formData = new FormData();

      formData.append("image", file);

      try {
        const res = await fetch(
          "http://localhost:5000/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

      setForm((prev) => ({
  ...prev,
  customerImage: data.imageUrl,
}));

        toast({
          message: "Image Uploaded",
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

  {form.customerImage && (
    <img
      src={form.customerImage}
      alt=""
      className="w-20 h-20 rounded-full object-cover mt-3 border"
    />
  )}
</div>
<div>
  <label className="label">
    Platform Logo
  </label>

  <input
    type="file"
    accept="image/*"
    className="input"
    onChange={async (e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const formData = new FormData();

      formData.append("image", file);

      formData.append("folder", "platforms");

      try {
        const res = await fetch(
          "http://localhost:5000/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        setForm((prev) => ({
          ...prev,
          platformLogo: data.imageUrl,
        }));

        toast({
          message: "Platform logo uploaded",
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

  {form.platformLogo && (
    <img
      src={form.platformLogo}
      className="mt-3 h-14 w-14 rounded-xl border object-contain bg-white p-2"
      alt=""
    />
  )}
</div>
              <div>
                <label className="label">
                  Review Date
                </label>

                <input
                  type="date"
                  className="input"
                  value={form.reviewDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      reviewDate:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="label">
                  Rating
                </label>

                <select
                  className="input"
                  value={form.rating}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rating: Number(
                        e.target.value
                      ),
                    })
                  }
                >
                  <option value={5}>
                    ⭐⭐⭐⭐⭐ (5)
                  </option>

                  <option value={4}>
                    ⭐⭐⭐⭐ (4)
                  </option>

                  <option value={3}>
                    ⭐⭐⭐ (3)
                  </option>

                  <option value={2}>
                    ⭐⭐ (2)
                  </option>

                  <option value={1}>
                    ⭐ (1)
                  </option>
                </select>
              </div>

              <div>
                <label className="label">
                  Display Order
                </label>

                <input
                  type="number"
                  className="input"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      displayOrder:
                        e.target.value,
                    })
                  }
                />
              </div>

            </div>

            <div>
              <label className="label">
                Review
              </label>

              <textarea
                className="input h-32"
                placeholder="Write customer review..."
                value={form.review}
                onChange={(e) =>
                  setForm({
                    ...form,
                    review:
                      e.target.value,
                  })
                }
              />
            </div>

            <label className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isActive:
                      e.target.checked,
                  })
                }
              />

              Active Review

            </label>

          </form>

        </Modal>
      )}
    </div>
      );
}