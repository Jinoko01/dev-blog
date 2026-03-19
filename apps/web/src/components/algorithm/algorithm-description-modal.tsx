"use client";

import { useEffect, useId, useState } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X, FileText } from "lucide-react";

export function AlgorithmDescriptionModal({
  title = "설명",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialogId = useId();
  const dragControls = useDragControls();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="fixed bottom-6 right-6 z-[60] inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/85 backdrop-blur-md shadow-lg text-[color:var(--color-card-foreground)] hover:shadow-xl transition-shadow"
        aria-haspopup="dialog"
        aria-controls={dialogId}
      >
        <FileText className="w-5 h-5 text-[color:var(--color-primary)]" />
        <span className="text-sm font-medium">설명 보기</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[70] pointer-events-none" aria-hidden={!open}>
            <motion.div
              role="dialog"
              aria-modal="false"
              id={dialogId}
              aria-label={title}
              className="pointer-events-auto fixed bottom-6 right-6 left-6 sm:left-auto sm:w-[min(720px,calc(100vw-3rem))] max-h-[80vh] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-2xl"
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              drag
              dragListener={false}
              dragControls={dragControls}
              dragMomentum={false}
              dragElastic={0.08}
            >
              <div
                className="algo-desc-drag-handle cursor-grab active:cursor-grabbing select-none flex items-center justify-between gap-4 px-5 py-4 border-b border-[color:var(--color-border)] bg-[color:var(--color-secondary)]/25"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[color:var(--color-card-foreground)] truncate">
                    {title}
                  </div>
                  <div className="text-xs text-[color:var(--color-muted-foreground)] mt-0.5">
                    드래그로 이동 · ESC로 닫기
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-[color:var(--color-secondary)]/50 transition-colors text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-auto max-h-[calc(80vh-64px)]">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

