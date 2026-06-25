"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  FaBook,
  FaCrown,
  FaHeart,
  FaHome,
  FaPlus,
  FaSignOutAlt,
  FaUser,
  FaUsers,
  FaFlag,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const DashboardSideBar = () => {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);

  const role = session?.user?.role || "user";
  const isPremium = session?.user?.isPremium || false;
  const userName = session?.user?.name?.trim() || "Guest User";

  const handleLogout = () => {};

  if (isPending) {
    return (
      <aside className="w-72 h-screen bg-slate-950 border-r border-white/5 flex items-center justify-center text-slate-400">
        Loading...
      </aside>
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
    { key: "admin-dashboard", label: "Admin Dashboard", icon: FaUsers, href: "/dashboard/admin" },
    { key: "manage-users", label: "Manage Users", icon: FaUsers, href: "/dashboard/admin/manage-users" },
    { key: "manage-lessons", label: "Manage Lessons", icon: FaBook, href: "/dashboard/admin/manage-lessons" },
    { key: "reported-lessons", label: "Reported Lessons", icon: FaFlag, href: "/dashboard/admin/reported-lessons" },
  ];

  const menuItems = role === "admin" ? adminMenu : userMenu;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden    p-4 bg-slate-950 border-b border-white/5 text-white">
       
        <button onClick={() => setOpen(true)}>
          <FaBars />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50 top-0 left-0
          h-screen w-72 bg-slate-950 border-r border-white/5
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="h-full flex flex-col">

          {/* Header */}
          <div className="px-6 py-6 border-b border-white/5 flex justify-between items-center">
            <Link href="/" onClick={() => setOpen(false)}>
              <h2 className="text-2xl font-bold text-white">
                📚 Digital Life Lessons
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Learn. Reflect. Grow.
              </p>
            </Link>

            <button className="md:hidden text-white" onClick={() => setOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {menuItems.map(({ key, label, icon: Icon, href }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/5 hover:text-white"
              >
                <span className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon size={16} />
                </span>
                <span>{label}</span>
              </Link>
            ))}

            {/* Upgrade */}
            {role !== "admin" && !isPremium && (
              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl mt-4 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold"
              >
                <FaCrown />
                Upgrade to Premium
              </Link>
            )}
            <div className="p-4 border-t border-white/5 space-y-2">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/5"
            >
              <FaHome />
              Back to Site
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10"
            >
              <FaSignOutAlt />
              Sign Out
            </button>
          </div>
          </nav>

          {/* Footer */}
          
        </div>
      </aside>
    </>
  );
};

export default DashboardSideBar;