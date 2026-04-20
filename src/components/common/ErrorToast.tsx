import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export interface ErrorToastProps {
  message: string | null;
  onDismiss: () => void;
  durationMs?: number;
}

export const ErrorToast = ({ message, onDismiss, durationMs = 3500 }: ErrorToastProps) => {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(id);
  }, [message, durationMs, onDismiss]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="error-toast"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-[400px] w-[92%]"
          role="alert"
        >
          <div className="bg-error text-error-foreground rounded-card shadow-pop px-4 py-3 flex items-start gap-2">
            <span aria-hidden>⚠️</span>
            <p className="text-sm flex-1">{message}</p>
            <button onClick={onDismiss} className="text-error-foreground/80 hover:text-error-foreground" aria-label="Đóng">
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
