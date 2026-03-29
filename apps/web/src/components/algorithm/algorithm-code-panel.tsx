"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

function buildLineNumbers(count: number) {
  return Array.from({ length: count }, (_, i) => String(i + 1));
}

export function AlgorithmCodePanel({
  code,
  language,
  htmlLight,
  htmlDark,
}: {
  code: string;
  language: string;
  htmlLight?: string;
  htmlDark?: string;
}) {
  const [copied, setCopied] = useState(false);

  const lineCount = useMemo(() => {
    const normalized = code.replace(/\r\n/g, "\n").replace(/\s+$/, "");
    if (!normalized) return 1;
    return normalized.split("\n").length;
  }, [code]);

  const lineNumbers = useMemo(() => buildLineNumbers(Math.max(1, lineCount)), [lineCount]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#1e1e1e] dark:bg-[color:var(--color-background-solid)]">
      <div className="bg-[#2d2d2d] dark:bg-[color:var(--color-secondary)] px-4 py-2.5 flex items-center justify-between border-b border-[#1e1e1e] dark:border-[color:var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="ml-4 text-m text-[color:var(--color-card-foreground)] font-bold">
            solution.{language || "txt"}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-secondary/40 text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-xs font-bold tracking-widest uppercase text-green-500">COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">COPY</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="flex-1 overflow-auto bg-[#1e1e1e] dark:bg-transparent">
        <div className="grid grid-cols-[auto_1fr] font-mono text-[13px] leading-relaxed">
          <div className="select-none text-right pr-4 pl-4 py-6 text-[#858585] dark:text-[color:var(--color-muted-foreground)] bg-black/0 border-r border-[#333] dark:border-[color:var(--color-border)]/50">
            {lineNumbers.map((n) => (
              <div key={n} className="leading-6">
                {n}
              </div>
            ))}
          </div>
          <div className="py-6 pr-6">
            {htmlLight || htmlDark ? (
              <>
                {htmlLight && (
                  <div
                    className="shiki-wrap dark:hidden"
                    dangerouslySetInnerHTML={{ __html: htmlLight }}
                  />
                )}
                {htmlDark && (
                  <div
                    className="shiki-wrap hidden dark:block"
                    dangerouslySetInnerHTML={{ __html: htmlDark }}
                  />
                )}
              </>
            ) : (
              <pre className="m-0 whitespace-pre leading-relaxed text-[#d4d4d4] dark:text-[color:var(--color-foreground)]">
                <code>{code}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

