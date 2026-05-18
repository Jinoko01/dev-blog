"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";

const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({ activeTab: "", setActiveTab: () => {} });

export function CodeTabs({
  children,
  tabs,
}: {
  children: React.ReactNode;
  tabs?: string[] | string;
}) {
  // Normalize tabs prop to array
  const parsedTabs = React.useMemo(() => {
    if (!tabs) {
      return [];
    }
    if (Array.isArray(tabs)) {
      return tabs;
    }
    if (typeof tabs === "string") {
      // Handle potential stringified array like "['npm', 'yarn']" just in case
      if (tabs.trim().startsWith("[") && tabs.trim().endsWith("]")) {
        try {
          // Replace single quotes with double quotes for JSON parsing
          return JSON.parse(tabs.replace(/'/g, '"'));
        } catch {
          // Fallback to simple split
        }
      }
      return tabs
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    return [];
  }, [tabs]);

  // Initialize state directly with the first tab to avoid hydration flash
  const [activeTab, setActiveTab] = useState(() => parsedTabs[0] || "");

  useEffect(() => {
    // Only update if current activeTab is no longer in the list
    if (
      parsedTabs &&
      parsedTabs.length > 0 &&
      !parsedTabs.includes(activeTab)
    ) {
      setActiveTab(parsedTabs[0]);
    }
  }, [parsedTabs, activeTab]);

  if (!parsedTabs || parsedTabs.length === 0) {
    return (
      <div className="border border-red-500 p-4 rounded text-white bg-red-900/50">
        <p className="font-bold">
          Error: CodeTabs requires a &apos;tabs&apos; array or comma-separated
          string.
        </p>
        <p>
          Example: <code>{'<CodeTabs tabs="npm, yarn, pnpm, bun">'}</code>
        </p>
        <div className="mt-4">{children}</div>
      </div>
    );
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="my-6 rounded-xl overflow-hidden bg-[#0d1117] border border-white/10 shadow-2xl relative">
        <div className="flex px-4 pt-2 gap-4 border-b border-white/10 bg-white/[0.02] overflow-x-auto scrollbar-hide">
          {parsedTabs.map((tab: string) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? "border-brand-500 text-white"
                  : "border-transparent text-white/50 hover:text-white/80 hover:border-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="[&>div]:!my-0 [&_pre]:!rounded-none [&_pre]:!border-none [&_pre]:!shadow-none">
          {children}
        </div>
      </div>
    </TabsContext.Provider>
  );
}

export function CodeTab({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { activeTab } = useContext(TabsContext);
  const [copied, setCopied] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Always render but hide with CSS to prevent flashing or context issues during hydration
  const isHidden = activeTab !== "" && activeTab !== title;

  const onCopy = () => {
    if (contentRef.current) {
      const text = contentRef.current.textContent || "";
      navigator.clipboard.writeText(text.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{ display: isHidden ? "none" : "block" }}
      className="w-full relative group"
    >
      <div
        ref={contentRef}
        className="px-4 py-2 overflow-x-auto text-base font-mono text-white/80 [&>div]:!my-0 [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_pre]:!border-none [&_pre]:!shadow-none [&_pre]:!rounded-none [&_button]:hidden"
      >
        {typeof children === "string" ? (
          <pre className="m-0! p-0!">
            <code>{children.trim()}</code>
          </pre>
        ) : (
          children
        )}
      </div>
      <button
        onClick={onCopy}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-md opacity-60 hover:opacity-100 transition-all border border-white/10 cursor-pointer z-10"
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
