"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // অ্যাক্টিভ রুট হাইলাইট করার জন্য যোগ করা হয়েছে
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
  const pathname = usePathname(); // বর্তমান ইউআরএল ট্র্যাক করবে

  const role = session?.user?.role || "user";
  const isPremium = session?.user?.isPremium || false;
  const userName = session?.user?.name?.trim() || "Guest User";

  const handleLogout = () => {
    // এখানে আপনার সাইন আউট লজিক (যেমন: authClient.signOut()) কল করবেন ভাই
    console.log("Logging out...");
  };

  if (isPending) {
    return (
      <aside className="w-72 h-screen bg-slate-950 border-r border-white/5 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Verifying session...</p>
        </div>
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
    { key: "admin-dashboard", label: "Admin Dashboard", icon: FaHome, href: "/dashboard/admin" },
    { key: "manage-users", label: "Manage Users", icon: FaUsers, href: "/dashboard/admin/manage-users" },
    { key: "manage-lessons", label: "Manage Lessons", icon: FaBook, href: "/dashboard/admin/manage-lessons" },
    { key: "reported-lessons", label: "Reported Lessons", icon: FaFlag, href: "/dashboard/admin/reported-lessons" },
  ];

  const menuItems = role === "admin" ? adminMenu : userMenu;

  return (
    <>
      {/* FIXED: Mobile Top Bar - স্টিকি করা হয়েছে যাতে স্ক্রল করলেও ওপরেই থাকে */}
      <div className="sticky top-0 z-40 md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-white/5 text-white w-full backdrop-blur-xl bg-slate-950/90">
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

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-sm transition-all duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen w-72 bg-slate-950 border-r border-white/5
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="h-full flex flex-col justify-between">
          
          <div>
            {/* Header */}
            <div className="px-6 py-6 border-b border-white/5 flex justify-between items-center">
              <Link href="/" onClick={() => setOpen(false)}>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  📚 Digital Life Lessons
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Logged in as: <span className="text-slate-300 font-medium">{userName}</span>
                </p>
              </Link>

              <button 
                className="md:hidden text-slate-400 hover:text-white p-1" 
                onClick={() => setOpen(false)}
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Navigation - Dynamic Route Highlight Feature Added */}
            <nav className="overflow-y-auto px-4 py-6 space-y-1.5 max-h-[calc(100vh-220px)]">
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
            </nav>
          </div>

          {/* FIXED: Bottom Options Footer - লেআউটের একদম নিচে স্ট্রাকচার্ড করা হয়েছে */}
          <div className="p-4 border-t border-white/5 bg-slate-950 space-y-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white text-sm font-medium transition"
            >
              <FaHome size={14} />
              <span>Back to Home</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 text-sm font-medium transition"
            >
              <FaSignOutAlt size={14} />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default DashboardSideBar;