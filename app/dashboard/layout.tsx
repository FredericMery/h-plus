"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      
      {/* Top header */}
      <header className="px-6 py-4 border-b border-white/5 backdrop-blur-xl bg-white/[0.02] sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
              +
            </div>
            <span className="font-semibold tracking-wide text-sm opacity-90">
              H+ Control
            </span>
          </div>

          <nav className="flex gap-6 text-sm">
            <Link
              href="/dashboard"
              className={`transition ${
                pathname === "/dashboard"
                  ? "text-indigo-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Tasks
            </Link>

            <Link
              href="/dashboard/memoire"
              className={`transition ${
                pathname.startsWith("/dashboard/memoire")
                  ? "text-indigo-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Mémoire
            </Link>

            <Link
              href="/dashboard/settings"
              className={`transition ${
                pathname.startsWith("/dashboard/settings")
                  ? "text-indigo-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8 pb-24">
        {children}
      </main>
    </div>
  );
}
