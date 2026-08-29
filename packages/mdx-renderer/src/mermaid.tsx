"use client";

import { useEffect, useId, useRef, useState } from "react";

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          background: "#0d1117",
          primaryColor: "#161b22",
          primaryTextColor: "#e6edf3",
          primaryBorderColor: "#e6edf3",
          lineColor: "#e6edf3",
          secondaryColor: "#161b22",
          tertiaryColor: "#161b22",
        },
      });

      try {
        const { svg, bindFunctions } = await mermaid.render(
          `mermaid-${id}`,
          chart,
        );
        if (cancelled || !containerRef.current) {
          return;
        }
        containerRef.current.innerHTML = svg;
        bindFunctions?.(containerRef.current);
      } catch {
        if (!cancelled) {
          setError(chart);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg bg-[#0d1117] p-4 text-white">
        {error}
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 flex w-full justify-center overflow-x-auto rounded-lg bg-[#0d1117] p-4"
    />
  );
}
