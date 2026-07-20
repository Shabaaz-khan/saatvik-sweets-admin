import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  Building2,
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  Package,
  X,
} from "lucide-react";

import {
  getCorporateInquiries,
  updateCorporateInquiry,
} from "../api/api";

import { useToast } from "../lib/toast";

const STATUS = [
  "new",
  "contacted",
  "closed",
];

const badgeStyle: Record<string, string> = {
  new: "bg-emerald-50 text-emerald-700",
  contacted: "bg-sky-50 text-sky-700",
  closed: "bg-rose-50 text-rose-700",
};

export default function CorporateInquiriesPage() {

  const toast = useToast();

  const [rows, setRows] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");

  const [selected, setSelected] =
    useState<any>(null);

  const [updating, setUpdating] =
    useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {

      const data =
        await getCorporateInquiries();

      setRows(data);

    } catch (err: any) {

      toast({
        message: err.message,
        type: "error",
      });

    }

    setLoading(false);
  }

  async function updateStatus(status: string) {

    if (!selected) return;

    setUpdating(true);

    try {

      await updateCorporateInquiry(
        selected._id,
        { status }
      );

      toast({
        message: "Status Updated",
        type: "success",
      });

      setSelected({
        ...selected,
        status,
      });

      load();

    } catch (err: any) {

      toast({
        message: err.message,
        type: "error",
      });

    }

    setUpdating(false);
  }

  const filtered = rows.filter((x) => {

    const q = query.toLowerCase();

    return (
      x.company.toLowerCase().includes(q) ||
      x.contact.toLowerCase().includes(q) ||
      x.email.toLowerCase().includes(q) ||
      x.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Corporate Inquiries
        </h1>

        <p className="text-stone-500 mt-1">
          Manage corporate gifting enquiries.
        </p>

      </div>

      <div className="card">

        <div className="p-4 border-b">

          <div className="relative max-w-sm">

            <Search
              className="absolute left-3 top-1/2
              -translate-y-1/2
              w-4 h-4 text-stone-400"
            />

            <input
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search..."
              className="input pl-10"
            />

          </div>

        </div>

        {loading ? (

          <div className="py-16 flex justify-center">

            <Loader2 className="animate-spin" />

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-stone-50">

                  <th className="p-4 text-left">
                    Company
                  </th>

                  <th className="p-4 text-left">
                    Contact
                  </th>

                  <th className="p-4 text-left">
                    Email
                  </th>

                  <th className="p-4 text-left">
                    Phone
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {filtered.map((row) => (

                  <tr
                    key={row._id}
                    onClick={() =>
                      setSelected(row)
                    }
                    className="border-b cursor-pointer hover:bg-stone-50"
                  >

                    <td className="p-4 font-semibold">
                      {row.company}
                    </td>

                    <td className="p-4">
                      {row.contact}
                    </td>

                    <td className="p-4">
                      {row.email}
                    </td>

                    <td className="p-4">
                      {row.phone}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyle[row.status]}`}
                      >
                        {row.status}
                      </span>

                    </td>

                    <td className="p-4">
                      {new Date(
                        row.createdAt
                      ).toLocaleDateString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
            {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />

          {/* Sidebar */}
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-y-auto animate-slide-in">

            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold">
                  Corporate Inquiry
                </h2>

                <p className="text-xs text-stone-400">
                  {new Date(
                    selected.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Body */}
            <div className="p-6 space-y-6">

              {/* Status */}
              <div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle[selected.status]}`}
                >
                  {selected.status.toUpperCase()}
                </span>

              </div>

              {/* Company */}
              <div className="space-y-4">

                <h3 className="text-xs uppercase tracking-wider text-stone-400">
                  Company Details
                </h3>

                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-stone-400" />
                  <span>{selected.company}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-stone-400" />
                  <span>{selected.quantity} Boxes</span>
                </div>

                <div className="flex items-center gap-3">
                  <IndianRupee className="w-4 h-4 text-stone-400" />
                  <span>{selected.budget || "-"}</span>
                </div>

              </div>

              {/* Contact */}
              <div className="space-y-4">

                <h3 className="text-xs uppercase tracking-wider text-stone-400">
                  Contact
                </h3>

                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-stone-400" />
                  <span>{selected.contact}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-stone-400" />
                  <span>{selected.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-stone-400" />
                  <span>{selected.phone}</span>
                </div>

              </div>

              {/* Event */}
              <div className="space-y-4">

                <h3 className="text-xs uppercase tracking-wider text-stone-400">
                  Event
                </h3>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  <span>
                    {selected.eventDate
                      ? new Date(
                          selected.eventDate
                        ).toLocaleDateString()
                      : "-"}
                  </span>
                </div>

              </div>

              {/* Message */}
              <div>

                <h3 className="text-xs uppercase tracking-wider text-stone-400 mb-2">
                  Message
                </h3>

                <div className="rounded-xl bg-stone-50 border p-4 text-sm leading-6 whitespace-pre-wrap">
                  {selected.message || "No message"}
                </div>

              </div>

              {/* Status Buttons */}
              <div>

                <h3 className="text-xs uppercase tracking-wider text-stone-400 mb-3">
                  Update Status
                </h3>

                <div className="grid grid-cols-3 gap-2">

                  {STATUS.map((s) => (

                    <button
                      key={s}
                      disabled={
                        updating ||
                        selected.status === s
                      }
                      onClick={() =>
                        updateStatus(s)
                      }
                      className={`rounded-lg border px-3 py-2 text-sm capitalize transition ${
                        selected.status === s
                          ? "bg-rose-600 text-white border-rose-600"
                          : "hover:bg-stone-50"
                      }`}
                    >
                      {s}
                    </button>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}