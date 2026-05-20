"use client";

import { useEffect, useState, type ReactNode } from "react";

export function RevealWrap({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setSeen(true), 0);
    return () => clearTimeout(id);
  }, []);
  return (
    <div
      className={`reveal${seen ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
