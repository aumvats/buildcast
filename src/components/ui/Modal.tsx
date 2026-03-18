'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-full max-w-lg rounded-lg border border-border bg-surface p-0 shadow-xl animate-scale-in backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-md hover:bg-bg active:scale-95 transition-all duration-fast min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
