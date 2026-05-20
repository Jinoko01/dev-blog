"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  width?: number;
  height?: number;
  squares?: [number, number];
  className?: string;
  fadeMs?: number;
};

export function InteractiveGrid({
  width = 56,
  height = 56,
  squares = [40, 24],
  className = "",
  fadeMs = 1100,
}: Props) {
  const [hovered, setHovered] = useState<Map<string, number>>(new Map());
  const [cols, rows] = squares;
  const lastCell = useRef<string | null>(null);

  useEffect(() => {
    if (hovered.size === 0) return;
    const id = setInterval(() => {
      const now = Date.now();
      setHovered((prev) => {
        let changed = false;
        const next = new Map(prev);
        for (const [k, t] of next) {
          if (now - t > fadeMs + 200) {
            next.delete(k);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 800);
    return () => clearInterval(id);
  }, [hovered.size, fadeMs]);

  const hit = (x: number, y: number) => {
    setHovered((prev) => {
      const next = new Map(prev);
      next.set(`${x},${y}`, Date.now());
      return next;
    });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const cellX = Math.floor((e.clientX - rect.left) / width);
    const cellY = Math.floor((e.clientY - rect.top) / height);
    if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
      const key = `${cellX},${cellY}`;
      if (key !== lastCell.current) {
        lastCell.current = key;
        hit(cellX, cellY);
      }
    }
  };

  const handleMouseLeave = () => {
    lastCell.current = null;
  };

  return (
    <svg
      className={`block cursor-default ${className}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ "--igrid-fade": `${fadeMs}ms` } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <pattern
          id="igrid-pattern"
          x="0"
          y="0"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.15"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#igrid-pattern)" />

      {Array.from({ length: rows * cols }).map((_, i) => {
        const x = i % cols;
        const y = Math.floor(i / cols);
        const key = `${x},${y}`;
        return (
          <rect
            key={key}
            x={x * width}
            y={y * height}
            width={width}
            height={height}
            className={hovered.has(key) ? "fill-primary animate-igrid-fade" : "fill-transparent"}
          />
        );
      })}
    </svg>
  );
}
