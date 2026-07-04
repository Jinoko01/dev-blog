"use client";

import { useRouter } from "next/navigation";
import { clearAdminToken } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    clearAdminToken();
    router.replace("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-3.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors border border-transparent text-[color:var(--color-destructive)] hover:bg-[color:var(--color-destructive)]/10 hover:border-[color:var(--color-destructive)]/20"
    >
      Logout
    </button>
  );
}
