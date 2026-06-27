"use client";

import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBook, FaCrown, FaHeart, FaHome, FaPlus,
  FaSignOutAlt, FaUser, FaUsers, FaFlag, FaBars, FaTimes,
} from "react-icons/fa";

const DashboardSideBar = () => {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const role = session?.user?.role || "user";
  const isPremium = session?.user?.isPremium || false;
  const userName = session?.user?.name?.trim() || "Guest User";

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (isPending) {
    return (
      <>
        <div className="md:hidden w-full flex items-center justify-center p-4 bg-slate-950 border-b border-white/5 text-slate-400">
          <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <aside className="hidden md:flex w-72 h-screen bg-slate-950 border-r border-white/5 items-center justify-center text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-slate-500">Verifying session...</p>
          </div>
        </aside>
      </>
    );
  }

  const userMenu = [
    { key: "dashboard", label: "Dashboard", icon: FaHome, href: "/dashboard/user" },
    { key: "add-lesson", label: "Add Lesson", icon: FaPlus, href: "/dashboard/user/add-lesson" },
    { key: "my-lessons", label: "My Lessons", icon: FaBook, href: "/dashboard/user/my-lessons" },
    { key: "favorites", label: "My Favorites", icon: FaHeart, href: "/dashboard/user/my-favorites" },
    { key: "profile", label: "Profile", icon: FaUser, href: "/dashboard/user/profile" },
  ];

  const adminMenu = [
    { key: "admin-dashboard", label: "Admin Dashboard", icon: FaHome, href: "/dashboard/admin" },
    { key: "manage-users", label: "Manage Users", icon: FaUsers, href: "/dashboard/admin/manage-users" },
    { key: "manage-lessons", label: "Manage Lessons", icon: FaBook, href: "/dashboard/admin/manage-lessons" },
    { key: "reported-lessons", label: "Reported Lessons", icon: FaFlag, href: "/dashboard/admin/reported-lessons" },
  ];

  const menuItems = role === "admin" ? adminMenu : userMenu;

  return (
    <>
      {/* ─── Mobile Top Bar ─── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-slate-950/95 border-b border-white/5 backdrop-blur-xl">
        <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
          📌 {role === "admin" ? "Admin Panel" : "User Portal"}
        </span>
        <button
          onClick={() => setOpen(true)}
          className="p-2 -mr-2 text-slate-300 hover:text-white transition"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Mobile top spacing */}
      <div className="md:hidden h-[52px] shrink-0" />

      {/* ─── Overlay ─── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72
          bg-slate-950 border-r border-white/5
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-white/5 flex justify-between items-center shrink-0">
          <Link href="/" onClick={() => setOpen(false)}>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              📚 Digital Life Lessons
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Logged in as:{" "}
              <span className="text-slate-300 font-medium">{userName}</span>
            </p>
          </Link>
          <button
            className="md:hidden text-slate-400 hover:text-white p-1"
            onClick={() => setOpen(false)}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {menuItems.map(({ key, label, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500/10 to-indigo-500/10 text-pink-400 border border-pink-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Icon size={16} className={isActive ? "text-pink-500" : "text-slate-400"} />
                <span>{label}</span>
              </Link>
            );
          })}

          {/* Upgrade Button */}
          {role !== "admin" && !isPremium && (
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl mt-5 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold text-sm shadow-md shadow-pink-500/10 hover:opacity-90 transition-all"
            >
              <FaCrown size={14} className="animate-bounce" />
              Upgrade to Premium
            </Link>
          )}

          {/* ─── Divider ─── */}
          <div className="my-3 border-t border-white/5" />

          {/* Back to Home */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm text-slate-400 hover:bg-white/5 hover:text-white border border-transparent transition-all duration-200"
          >
            <FaHome size={16} className="text-slate-400" />
            <span>Back to Home</span>
          </Link>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm text-red-400 hover:bg-red-500/10 border border-transparent transition-all duration-200"
          >
            <FaSignOutAlt size={16} className="text-red-400" />
            <span>Log Out</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default DashboardSideBar; 