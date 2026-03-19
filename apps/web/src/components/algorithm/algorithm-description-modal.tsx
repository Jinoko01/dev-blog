"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X, FileText, GripHorizontal } from "lucide-react";

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
  const constraintsRef = useRef<HTMLDivElement>(null);

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
      {/* 플로팅 버튼 */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-6 right-6 z-60 inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card/90 backdrop-blur-md shadow-lg text-card-foreground hover:shadow-xl transition-shadow cursor-pointer"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={open}
      >
        <FileText className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium">{open ? "닫기" : "설명 보기"}</span>
      </motion.button>

      {/* 드래그 제약 영역 (viewport 기준 전체) */}
      <div
        ref={constraintsRef}
        className="fixed inset-0 z-70 pointer-events-none"
        aria-hidden={!open}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-modal="false"
              id={dialogId}
              aria-label={`${title} 설명`}
              className="pointer-events-auto absolute bottom-6 right-6 left-6 sm:left-auto sm:w-[min(680px,calc(100vw-3rem))] max-h-[78vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl flex flex-col"
              initial={{ y: 20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              drag
              dragListener={false}
              dragControls={dragControls}
              dragMomentum={false}
              dragElastic={0.05}
              dragConstraints={constraintsRef}
            >
              {/* 드래그 핸들 헤더 */}
              <div
                className="cursor-grab active:cursor-grabbing select-none flex items-center justify-between gap-4 px-5 py-3.5 border-b border-border bg-secondary/20 shrink-0"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <GripHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-card-foreground truncate">
                      설명
                    </div>
                    <div className="text-xs text-muted-foreground">
                      드래그로 이동 · ESC로 닫기
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 스크롤 가능한 본문 */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
