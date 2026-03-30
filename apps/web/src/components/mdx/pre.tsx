"use client";

import { useState, useRef } from "react";
import { Check, Copy } from "lucide-react";

export function Pre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const onCopy = () => {
    if (preRef.current) {
      const text = preRef.current.textContent || "";
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group/code my-6">
      <pre ref={preRef} {...props} className={`${props.className || ""} !m-0 overflow-x-auto rounded-lg`}>
        {children}
      </pre>
      <button
        onClick={onCopy}
        className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-md opacity-0 group-hover/code:opacity-100 transition-all border border-white/10 cursor-pointer"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-white/70" />
        )}
      </button>
    </div>
  );
}
