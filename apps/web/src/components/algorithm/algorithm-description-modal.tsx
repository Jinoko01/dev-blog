"use client";

import { useEffect, useId, useState } from "react";
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

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-18 sm:bottom-6 right-6 z-60 inline-flex items-center gap-2 px-4 py-3.5 rounded-full border border-border bg-[color:var(--color-card)] shadow-xl text-[color:var(--color-card-foreground)] hover:shadow-2xl transition-all cursor-pointer"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={open}
      >
        <FileText className="w-5 h-5 text-[color:var(--color-primary)]" />
        <span className="text-xs font-bold tracking-widest uppercase">
          {open ? "CLOSE" : "INFO"}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-70 pointer-events-none"
          aria-hidden={!open}
        >
          <div
            role="dialog"
            aria-modal="false"
            id={dialogId}
            aria-label={`${title} 설명`}
            className="pointer-events-auto absolute bottom-6 right-6 left-6 sm:left-auto sm:w-[min(680px,calc(100vw-3rem))] max-h-[78vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl flex flex-col"
          >
            {/* 헤더 */}
            <div className="select-none flex items-center justify-between gap-4 px-5 py-3.5 border-b border-border bg-secondary/20 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <GripHorizontal className="w-4 h-4 text-[color:var(--color-muted-foreground)] shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-card-foreground)] truncate">
                    {title}
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[color:var(--color-muted-foreground)] mt-0.5">
                    ESC to close
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
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
