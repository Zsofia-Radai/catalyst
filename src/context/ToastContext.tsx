import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { ToastNotification } from "../ui/ToastNotification/ToastNotification";

type ToastType = "success" | "delete" | "error";

type Toast = {
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const value: ToastContextValue = {
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast && <ToastNotification type={toast.type} message={toast.message} />}
    </ToastContext.Provider>
  );
}
