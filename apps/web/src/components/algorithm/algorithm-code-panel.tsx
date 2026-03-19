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
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const lines = useMemo(() => {
    const normalized = code.replace(/\r\n/g, "\n").replace(/\s+$/, "");
    return normalized ? normalized.split("\n") : [];
  }, [code]);

  const lineNumbers = useMemo(() => buildLineNumbers(Math.max(1, lines.length)), [lines.length]);

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
    <div className="bg-[color:var(--color-card)] rounded-xl shadow-sm border border-[color:var(--color-border)] overflow-hidden">
      <div className="bg-[color:var(--color-secondary)]/50 px-4 py-3 flex items-center justify-between border-b border-[color:var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="ml-4 text-sm text-[color:var(--color-card-foreground)] font-medium">
            solution.{language || "txt"}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[color:var(--color-primary)]/10 hover:bg-[color:var(--color-primary)]/20 text-[color:var(--color-primary)] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm">복사됨!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">복사</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-[auto_1fr] font-mono text-sm">
          <div className="select-none text-right pr-4 pl-4 py-6 text-[color:var(--color-muted-foreground)] bg-black/0">
            {lineNumbers.map((n) => (
              <div key={n} className="leading-6">
                {n}
              </div>
            ))}
          </div>
          <pre className="m-0 py-6 pr-6 whitespace-pre leading-6 text-[color:var(--color-foreground)]">
            <code>
              {(lines.length ? lines : [""]).map((ln, idx) => (
                <div key={idx}>{ln}</div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

