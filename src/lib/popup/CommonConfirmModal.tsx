"use client";

import { useEffect } from "react";

interface props {
  open: boolean;
  setShowModal: (value: boolean) => void;
  selectedData: any;
  DeleteFunc: () => void;
}

const CommonConfirmModal = ({
  open,
  setShowModal,
  selectedData,
  DeleteFunc,
}:props) => {

  const handleClose = () => {
    setShowModal(false);
  };

  const title =
    selectedData?.name ||
    selectedData?.firstName ||
    selectedData?.question ||
    "Item";

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e:any) => {
      if (e.key === "Escape") handleClose();
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* ===== Overlay ===== */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* ===== Modal Box ===== */}
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg animate-fadeIn">

        {/* Header */}
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>
        </div>

        {/* Body */}
        <div className="px-5 py-4 text-gray-600">
          Do you want to delete this{" "}
          <span className="font-semibold text-gray-800">
            "{title}"
          </span>
          ?
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-5 py-4">

          <button
            onClick={handleClose}
            className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              handleClose();
              DeleteFunc();
            }}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
};

export default CommonConfirmModal;
