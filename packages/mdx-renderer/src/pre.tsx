"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Mermaid } from "./mermaid";

export function Pre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const [mermaidCode, setMermaidCode] = useState<string | null>(null);

  const isMermaid =
    (props as Record<string, unknown>)["data-language"] === "mermaid";

  useEffect(() => {
    if (isMermaid && preRef.current) {
      setMermaidCode(preRef.current.textContent || "");
    }
  }, [isMermaid]);

  const onCopy = () => {
    if (preRef.current) {
      const text = preRef.current.textContent || "";
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isMermaid) {
    return (
      <>
        <pre ref={preRef} {...props} className="hidden">
          {children}
        </pre>
        {mermaidCode && <Mermaid chart={mermaidCode} />}
      </>
    );
  }

  return (
    <div className="group/code relative my-6 w-full max-w-full">
      <pre
        ref={preRef}
        {...props}
        className={`${props.className || ""} m-0! w-full overflow-x-auto rounded-lg`}
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={onCopy}
        className="absolute right-3 top-3 cursor-pointer rounded-md border border-white/10 bg-white/10 p-2 opacity-0 backdrop-blur-sm transition-all hover:bg-white/20 group-hover/code:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-white/70" />
        )}
      </button>
    </div>
  );
}
