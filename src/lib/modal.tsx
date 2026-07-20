import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({
  title,
  children,
  footer,
  onClose,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
})
{
  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6">
          {children}
        </div>
        {footer && (
  <div className="sticky bottom-0 border-t bg-white px-6 py-4 flex justify-end gap-3">
    {footer}
  </div>
)}
      </div>
    </div>,
    document.body
  );
}