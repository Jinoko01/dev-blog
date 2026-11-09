"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X, FileText, GripHorizontal } from "lucide-react";

export function AlgorithmDescriptionModal({
  title = "풀이 설명",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialogId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeDescription = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDescription();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeDescription]);

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        type="button"
        ref={triggerRef}
        onClick={open ? closeDescription : () => setOpen(true)}
        className="fixed bottom-18 sm:bottom-6 right-6 z-60 inline-flex items-center gap-2 px-4 py-3.5 rounded-full border border-border bg-[color:var(--color-card)] shadow-xl text-[color:var(--color-card-foreground)] hover:shadow-2xl transition-all cursor-pointer"
        aria-haspopup="dialog"
        aria-controls={open ? dialogId : undefined}
        aria-expanded={open}
      >
        <FileText className="w-5 h-5 text-[color:var(--color-primary)]" />
        <span className="text-xs font-bold tracking-widest uppercase">
          {open ? `${title} 닫기` : title}
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
            aria-label={title}
            className="pointer-events-auto absolute bottom-18 right-6 left-6 sm:bottom-6 sm:left-auto sm:w-[min(680px,calc(100vw-3rem))] max-h-[min(78dvh,calc(100dvh-6rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl flex flex-col"
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
                    Esc로 닫기
                  </div>
                </div>
              </div>
              <button
                type="button"
                ref={closeButtonRef}
                onClick={closeDescription}
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
