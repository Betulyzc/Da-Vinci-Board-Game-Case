import { useEffect, useRef, useState } from "react";

export type ToastType = "success" | "warning" | "error";
export type ToastState = { text: string; type: ToastType } | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const timerRef = useRef<number | null>(null);

  const showToast = (
    text: string,
    type: ToastType = "success",
    durationMs = 2500
  ) => {
    setToast({ text, type });
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(null), durationMs);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return { toast, showToast };
}
