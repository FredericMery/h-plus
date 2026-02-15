"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useRouter } from "next/navigation";
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
  const [mobileOpen, setMobileOpen] = useState(false);



  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;

  return (
  <div className="flex min-h-screen bg-gray-50">
    {/* Sidebar desktop */}
    <div className="hidden md:flex w-64 bg-white border-r p-6 flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white text-xl font-bold">
          +
        </div>
        <span className="text-lg font-semibold">
          My Hyppocampe
        </span>
      </div>

      <nav className="flex flex-col gap-2">
  <Link
    href="/dashboard"
    className={`px-3 py-2 rounded-lg text-sm transition ${
      pathname === "/dashboard"
        ? "bg-black text-white"
        : "text-gray-600 hover:bg-gray-200"
    }`}
  >
    Tasks
  </Link>

  <Link
    href="/dashboard/memoire"
    className={`px-3 py-2 rounded-lg text-sm transition ${
      pathname.startsWith("/dashboard/memoire")
        ? "bg-black text-white"
        : "text-gray-600 hover:bg-gray-200"
    }`}
  >
    Memory
  </Link>

  <Link
    href="/dashboard/settings"
    className={`px-3 py-2 rounded-lg text-sm transition ${
      pathname.startsWith("/dashboard/settings")
        ? "bg-black text-white"
        : "text-gray-600 hover:bg-gray-200"
    }`}
  >
    Settings
  </Link>
</nav>



    </div>

    {/* Main */}
    <div className="flex-1 flex flex-col">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b p-4">
  <button
    onClick={() => setMobileOpen(true)}
    className="text-gray-600"
  >
    ☰
  </button>

  <div className="flex items-center gap-2">
    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
      +
    </div>
    <span className="font-semibold">
      My Hyppocampe
    </span>
  </div>

  <div className="w-6" />
</div>


{/* Mobile Drawer */}
{mobileOpen && (
  <div className="fixed inset-0 z-50 flex">
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black/30"
      onClick={() => setMobileOpen(false)}
    />

    {/* Drawer */}
    <div className="relative w-64 bg-white p-6 shadow-xl">
      <button
        onClick={() => setMobileOpen(false)}
        className="mb-6 text-gray-500"
      >
        ✕
      </button>

      <nav className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="px-3 py-2 rounded-lg text-sm hover:bg-gray-200"
        >
          Tasks
        </Link>

        <Link
          href="/dashboard/memoire"
          onClick={() => setMobileOpen(false)}
          className="px-3 py-2 rounded-lg text-sm hover:bg-gray-200"
        >
          Memory
        </Link>

        <Link
          href="/dashboard/settings"
          onClick={() => setMobileOpen(false)}
          className="px-3 py-2 rounded-lg text-sm hover:bg-gray-200"
        >
          Settings
        </Link>
      </nav>
    </div>
  </div>
)}



      {/* Content */}
      <div className="p-6 md:p-10">
        {children}
      </div>
    </div>
  </div>
);

}
