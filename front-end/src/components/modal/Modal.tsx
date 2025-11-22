import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  actionText: string;
  onClose: () => void;
  onAction?: () => void;
}

export default function Modal({
  isOpen,
  title,
  message,
  actionText,
  onClose,
  onAction,
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

                <h2 className="text-xl text-center font-bold mb-2">
                  {title}
                </h2>

                <div className="w-100 h-1 bg-gray-200 mx-auto mb-6 rounded-full"></div>

                <p className="mb-6">
                  {message}
                </p>

                <div className="flex gap-4 justify-center">
                  <button
                    className="px-6 py-2 bg-primary-orange text-white rounded-lg font-semibold cursor-pointer hover:scale-110 transition-transform"
                    onClick={onAction || onClose}
                  >
                    {actionText}
                  </button>
                </div>
              </div>

            </div>
  )
 
}
