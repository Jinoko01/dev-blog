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
      className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200 w-full text-left"
    >
      Logout
    </button>
  );
}
