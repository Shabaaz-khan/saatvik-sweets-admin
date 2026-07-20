import { useEffect, useMemo, useState } from "react";
import {
  TicketPercent,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
} from "lucide-react";

import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../api/api";
import Modal from "../lib/modal";
import { useToast } from "../lib/toast";
import type { Coupon } from "../lib/types";

type FormState = {
  code: string;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  minimumOrderValue: string;
  maximumDiscount: string;
  usageLimit: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

const empty: FormState = {
  code: "",
  name: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minimumOrderValue: "0",
  maximumDiscount: "0",
  usageLimit: "0",
  startDate: "",
  endDate: "",
  isActive: true,
};

export default function CouponsPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [rows, setRows] = useState<Coupon[]>([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editing, setEditing] = useState<Coupon | null>(null);

  const [form, setForm] = useState<FormState>(empty);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {
const data = await getCoupons();

console.log("Coupons API:", data);

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

  function openEdit(coupon: Coupon) {
    setEditing(coupon);

    setForm({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minimumOrderValue: String(coupon.minimumOrderValue),
      maximumDiscount: String(coupon.maximumDiscount),
      usageLimit: String(coupon.usageLimit),
      startDate: coupon.startDate.substring(0, 10),
      endDate: coupon.endDate.substring(0, 10),
      isActive: coupon.isActive,
    });

    setShowModal(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    try {
      const payload = {
        code: form.code.toUpperCase(),
        name: form.name,
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minimumOrderValue: Number(form.minimumOrderValue),
        maximumDiscount: Number(form.maximumDiscount),
        usageLimit: Number(form.usageLimit),
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive,
      };

      if (editing) {
        await updateCoupon(editing._id, payload);
      } else {
        await createCoupon(payload);
      }

      toast({
        message: editing
          ? "Coupon Updated"
          : "Coupon Created",
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

  async function remove(coupon: Coupon) {
    if (!confirm(`Delete ${coupon.code}?`)) return;

    try {
      await deleteCoupon(coupon._id);

      toast({
        message: "Coupon Deleted",
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
        x.code.toLowerCase().includes(search.toLowerCase()) ||
        x.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [rows, search]);
    return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-stone-900">
            Coupons
          </h1>

          <p className="text-stone-500 mt-1">
            Create and manage discount coupons.
          </p>
        </div>

        <button
          onClick={openNew}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>

      </div>

      <div className="relative">

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search coupon..."
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

                <th className="text-left p-4">Code</th>

                <th className="text-left p-4">Discount</th>

                <th className="text-left p-4">Minimum</th>

                <th className="text-left p-4">Used</th>

                <th className="text-left p-4">Status</th>

                <th className="text-right p-4">Action</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((coupon) => (

                <tr
                  key={coupon._id}
                  className="border-b"
                >

                  <td className="p-4 font-semibold">

                    {coupon.code}

                  </td>

                  <td className="p-4">

                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}

                  </td>

                  <td className="p-4">

                    ₹{coupon.minimumOrderValue}

                  </td>

                  <td className="p-4">

                    {coupon.usedCount}

                  </td>

                  <td className="p-4">

                    {coupon.isActive ? (

                      <span className="badge-success">

                        Active

                      </span>

                    ) : (

                      <span className="badge-danger">

                        Disabled

                      </span>

                    )}

                  </td>

                  <td className="p-4">

                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => openEdit(coupon)}
                        className="btn-secondary"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => remove(coupon)}
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
    title={editing ? "Edit Coupon" : "New Coupon"}
    onClose={() => setShowModal(false)}
    footer={
      <>
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="btn-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          form="coupon-form"
          disabled={saving}
          className="btn-primary"
        >
          {saving && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}

          {editing ? "Update Coupon" : "Save Coupon"}
        </button>
      </>
    }
  >
    <form
      id="coupon-form"
      onSubmit={save}
      className="space-y-5"
    >


            <div className="flex items-center gap-2 mb-3">

              <TicketPercent className="text-rose-600" />

              <h2 className="text-xl font-semibold">

                {editing ? "Edit Coupon" : "New Coupon"}

              </h2>

            </div>

            <div className="grid grid-cols-2 gap-4">
<div>
  <label className="label">Coupon Code</label>

  <input
    className="input"
    placeholder="e.g. WELCOME20"
    value={form.code}
    onChange={(e) =>
      setForm({
        ...form,
        code: e.target.value,
      })
    }
  />
</div>

<div>
  <label className="label">Coupon Name</label>

  <input
    className="input"
    placeholder="e.g. Welcome Offer"
    value={form.name}
    onChange={(e) =>
      setForm({
        ...form,
        name: e.target.value,
      })
    }
  />
</div>

<div>
  <label className="label">Discount Type</label>

  <select
    className="input"
    value={form.discountType}
    onChange={(e) =>
      setForm({
        ...form,
        discountType: e.target.value as any,
      })
    }
  >
    <option value="percentage">
      Percentage (%)
    </option>

    <option value="fixed">
      Fixed Amount (₹)
    </option>
  </select>
</div>

<div>
  <label className="label">
    Discount Value
  </label>

  <input
    type="number"
    className="input"
    placeholder={
      form.discountType === "percentage"
        ? "e.g. 10"
        : "e.g. 200"
    }
    value={form.discountValue}
    onChange={(e) =>
      setForm({
        ...form,
        discountValue: e.target.value,
      })
    }
  />
</div>

<div>
  <label className="label">
    Minimum Order Amount
  </label>

  <input
    type="number"
    className="input"
    placeholder="e.g. 1000"
    value={form.minimumOrderValue}
    onChange={(e) =>
      setForm({
        ...form,
        minimumOrderValue: e.target.value,
      })
    }
  />
</div>

<div>
  <label className="label">
    Maximum Discount
  </label>

  <input
    type="number"
    className="input"
    placeholder="e.g. 500"
    value={form.maximumDiscount}
    onChange={(e) =>
      setForm({
        ...form,
        maximumDiscount: e.target.value,
      })
    }
  />
</div>

<div>
  <label className="label">
    Usage Limit
  </label>

  <input
    type="number"
    className="input"
    placeholder="e.g. 100"
    value={form.usageLimit}
    onChange={(e) =>
      setForm({
        ...form,
        usageLimit: e.target.value,
      })
    }
  />
</div>

<div>
  <label className="label">
    Start Date
  </label>

  <input
    type="date"
    className="input"
    value={form.startDate}
    onChange={(e) =>
      setForm({
        ...form,
        startDate: e.target.value,
      })
    }
  />
</div>

<div>
  <label className="label">
    Expiry Date
  </label>

  <input
    type="date"
    className="input"
    value={form.endDate}
    onChange={(e) =>
      setForm({
        ...form,
        endDate: e.target.value,
      })
    }
  />
</div>

            </div>
<div>
  <label className="label">
    Description
  </label>

  <textarea
    className="input h-24"
    placeholder="e.g. Get 10% off on your first order."
    value={form.description}
    onChange={(e) =>
      setForm({
        ...form,
        description: e.target.value,
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
        isActive: e.target.checked,
      })
    }
  />

  Active Coupon
</label>

            {/* <div className="flex justify-end gap-3 pt-4">

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
              >

                {saving && (
                  <Loader2 className="animate-spin w-4 h-4" />
                )}

                {editing ? "Update" : "Save"}

              </button>

            </div> */}

          </form>
</Modal>
        

      )}

    </div>
  );
}