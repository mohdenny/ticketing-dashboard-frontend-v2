import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  isDestructive = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1C1B1F]/40 backdrop-blur-[2px]"
        onClick={onCancel}
      />

      {/* Dialog Card */}
      <div className="relative bg-[#F7F2FA] w-full max-w-[312px] rounded-[28px] p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-[#1C1B1F] text-2xl font-normal leading-8 mb-4">
          {title}
        </h2>
        <p className="text-[#49454F] text-sm leading-5 mb-6">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[#6750A4] text-sm font-semibold hover:bg-[#6750A4]/10 rounded-full transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
              isDestructive
                ? 'text-[#B3261E] hover:bg-[#B3261E]/10'
                : 'text-[#6750A4] hover:bg-[#6750A4]/10'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
