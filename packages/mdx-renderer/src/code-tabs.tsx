"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, Copy } from "lucide-react";

const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({ activeTab: "", setActiveTab: () => {} });

export function CodeTabs({
  children,
  tabs,
}: {
  children: ReactNode;
  tabs?: string[] | string;
}) {
  const parsedTabs = useMemo(() => {
    if (!tabs) {
      return [];
    }
    if (Array.isArray(tabs)) {
      return tabs;
    }
    if (typeof tabs === "string") {
      if (tabs.trim().startsWith("[") && tabs.trim().endsWith("]")) {
        try {
          return JSON.parse(tabs.replace(/'/g, '"')) as string[];
        } catch {
          // Fall through to comma-separated parsing.
        }
      }
      return tabs
        .split(",")
        .map((tab) => tab.trim())
        .filter(Boolean);
    }
    return [];
  }, [tabs]);

  const [activeTab, setActiveTab] = useState(() => parsedTabs[0] || "");
  const selectedTab = parsedTabs.includes(activeTab)
    ? activeTab
    : parsedTabs[0] || "";

  if (parsedTabs.length === 0) {
    return (
      <div className="rounded border border-red-500 bg-red-900/50 p-4 text-white">
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
    <TabsContext.Provider value={{ activeTab: selectedTab, setActiveTab }}>
      <div className="relative my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl">
        <div
          role="tablist"
          aria-label="Code examples"
          className="scrollbar-hide flex gap-4 overflow-x-auto border-b border-white/10 bg-white/[0.02] px-4 pt-2"
        >
          {parsedTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={selectedTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-medium transition-all ${
                selectedTab === tab
                  ? "border-orange-500 text-white"
                  : "border-transparent text-white/50 hover:border-white/20 hover:text-white/80"
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
  children: ReactNode;
  title: string;
}) {
  const { activeTab } = useContext(TabsContext);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
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
      role="tabpanel"
      aria-label={title}
      hidden={isHidden}
      className="group relative w-full"
    >
      <div
        ref={contentRef}
        className="overflow-x-auto px-4 py-2 font-mono text-base text-white/80 [&>div]:!my-0 [&_button]:hidden [&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!border-none [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!shadow-none"
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
        type="button"
        onClick={onCopy}
        className="absolute right-4 top-4 z-10 cursor-pointer rounded-md border border-white/10 bg-white/10 p-2 opacity-60 backdrop-blur-sm transition-all hover:bg-white/20 hover:opacity-100"
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
