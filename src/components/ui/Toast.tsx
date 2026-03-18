'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: CheckCircle,
};

const colorMap = {
  success: 'border-success text-success',
  error: 'border-error text-error',
  warning: 'border-warning text-accent',
  info: 'border-primary text-primary',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = iconMap[toast.type];
  return (
    <div
      className={`flex items-center gap-3 bg-surface border rounded-md px-4 py-3 shadow-lg min-w-[280px] animate-slide-in-right ${colorMap[toast.type]}`}
    >
      <Icon size={18} />
      <span className="text-text-primary text-sm flex-1">{toast.message}</span>
      <button onClick={onDismiss} className="p-1 hover:bg-bg rounded cursor-pointer transition-colors duration-fast">
        <X size={14} className="text-text-secondary" />
      </button>
    </div>
  );
}

export function Toaster() {
  return null; // ToastProvider wraps at layout level
}
