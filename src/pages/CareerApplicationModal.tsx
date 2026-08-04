import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  application: any;
};

export default function CareerApplicationModal({
  open,
  onClose,
  application,
}: Props) {
  if (!open || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
          <h2 className="text-2xl font-bold">
            Candidate Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-stone-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-6 p-6">

          <div>
            <label className="text-sm text-stone-500">
              Full Name
            </label>

            <p className="mt-1 font-semibold">
              {application.fullName}
            </p>
          </div>

          <div>
            <label className="text-sm text-stone-500">
              Email
            </label>

            <p className="mt-1">
              {application.email}
            </p>
          </div>

          <div>
            <label className="text-sm text-stone-500">
              Phone
            </label>

            <p className="mt-1">
              {application.phone}
            </p>
          </div>

          <div>
            <label className="text-sm text-stone-500">
              Current Location
            </label>

            <p className="mt-1">
              {application.currentLocation}
            </p>
          </div>

          <div>
            <label className="text-sm text-stone-500">
              Experience
            </label>

            <p className="mt-1">
              {application.experience}
            </p>
          </div>

          <div>
            <label className="text-sm text-stone-500">
              Applied Position
            </label>

            <p className="mt-1 font-semibold">
              {application.career?.title}
            </p>
          </div>

          <div>
            <label className="text-sm text-stone-500">
              Cover Letter
            </label>

            <div className="mt-2 rounded-xl bg-stone-50 p-4 leading-7">
              {application.coverLetter || "-"}
            </div>
          </div>

          <div>
            <label className="text-sm text-stone-500">
              Resume
            </label>

            <div className="mt-3 flex gap-3">

              <a
                href={application.resume}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:opacity-90"
              >
                View Resume
              </a>

              <a
                href={application.resume}
                download
                className="rounded-lg border border-primary px-5 py-3 font-semibold text-primary hover:bg-primary hover:text-white"
              >
                Download Resume
              </a>

            </div>
          </div>

          <div>
            <label className="text-sm text-stone-500">
              Current Status
            </label>

            <div className="mt-2 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
              {application.status}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}