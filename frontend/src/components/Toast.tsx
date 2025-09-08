import { AnimatePresence, motion } from "framer-motion";
import type { ToastState } from "../hooks/useToast";

type Props = { toast: ToastState };

export default function Toast({ toast }: Props) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.text + "-" + toast.type}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`fixed bottom-5 right-5 z-50 px-6 py-3 rounded-2xl backdrop-blur-md text-white font-semibold
            ${
              toast.type === "success"
                ? "bg-emerald-500/20 border border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                : toast.type === "warning"
                ? "bg-sky-500/20 border border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                : "bg-rose-500/20 border border-rose-400/40 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
            }`}
        >
          {toast.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
