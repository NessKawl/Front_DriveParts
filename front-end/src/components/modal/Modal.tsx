import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  actionText: string;
  onClose: () => void;
  onAction?: () => void;
  cancelText?: string;
  onCancel?: () => void;
  children?: React.ReactNode;
}

export default function Modal({
  isOpen,
  title,
  message,
  actionText,
  onClose,
  onAction,
  cancelText,
  onCancel,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-[90%] max-w-md text-center shadow-lg max-h-[90vh] overflow-y-auto">

        <div className="flex justify-end mb-3">
          <X
            size={30}
            color="#000000ff"
            onClick={onClose}
            className="cursor-pointer hover:scale-110 transition-transform"
          />
        </div>

        <h2 className="text-xl font-bold mb-2">
          {title}
        </h2>

        <div className="w-full h-1 bg-gray-200 mx-auto mb-6 rounded-full"></div>

        <p className="mb-10">{message}</p>

        {children && <div className="mb-6">{children}</div>}

        <div className="flex gap-4 justify-center">
          {cancelText && (
            <button
              className="px-6 py-2 bg-gray-200 text-black rounded-lg font-semibold hover:scale-105 transition-transform"
              onClick={onCancel || onClose}
            >
              {cancelText}
            </button>
          )}

          <button
            className="px-6 py-2 bg-primary-orange text-white rounded-lg font-semibold hover:scale-105 transition-transform"
            onClick={onAction || onClose}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
}
