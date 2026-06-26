"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaUser, FaSignOutAlt, FaThLarge, FaBars, FaTimes, FaBolt } from "react-icons/fa";
import { authClient, useSession } from "@/lib/auth-client";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await authClient.signOut();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  const closeMenu = useCallback(() => setMobileOpen(false), []);

  const user = session?.user;
  const isFreePlan = user?.plan === "free" || !user?.plan;

  // ড্যাশবোর্ড রাউট সেফলি হ্যান্ডেল করার জন্য রোল লোয়ারকেস করা (যেমন: user, admin)
  const userRole = user?.role ? user.role.toLowerCase() : "user";

  const navLink = (href, label, exact = false) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`text-sm font-medium transition-colors ${
          isActive ? "text-pink-500 font-semibold" : "text-slate-300 hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  const mobileNavLink = (href, label, exact = false, extra = "") => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        href={href}
        onClick={closeMenu}
        className={`block w-full py-2 px-3 rounded-xl text-sm font-medium transition-colors ${extra} ${
          isActive
            ? "text-pink-500 bg-pink-500/10"
            : "text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/65 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* HAMBURGER (mobile) */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 text-slate-300 hover:text-white transition-colors"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>

        {/* LOGO: লোগো অ্যাড করা হয়েছে যাতে লেআউট নষ্ট না হয় */}
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
          DevLessons
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLink("/", "Home", true)}
          {navLink("/public-lessons", "Public Lessons")}
          {user && navLink("/dashboard/user/add-lesson", "Add Lesson")}
          {user && navLink("/dashboard/user/my-lessons", "My Lessons")}
          {user && isFreePlan && (
            <Link
              href="/pricing"
              className={`text-sm font-semibold transition-colors ${
                pathname === "/pricing" ? "text-pink-400" : "text-pink-500 hover:text-pink-400"
              }`}
            >
              Upgrade ✦
            </Link>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          
          {!session && (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="hidden sm:inline-flex items-center justify-center font-semibold text-xs text-slate-300 hover:text-white h-9 px-4 rounded-xl hover:bg-white/5 transition">
                  Login
                </button>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center font-semibold text-xs bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition h-9 px-4 rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          )}

          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center transition-transform hover:scale-105 outline-none focus:outline-none cursor-pointer"
                aria-label="User menu"
              >
                <Image
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border border-pink-500 shadow-md shadow-pink-500/10"
                  src={user.image || "/default-avatar.png"}
                  alt="avatar"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User info */}
                  <div className="px-4 py-2.5 border-b border-white/5 mb-1.5 cursor-default">
                    <p className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">
                      {user.role || "Member"} Account
                    </p>
                    <p className="font-bold text-white text-sm mt-0.5 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>

                  <Link
                    href="/dashboard/user/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <FaUser className="text-slate-400 text-sm shrink-0" />
                    <span>Profile</span>
                  </Link>

                  {/* FIXED DYNAMIC DASHBOARD ROUTE (Safely lowercase) */}
                  <Link
                    href={`/dashboard/${userRole}`}
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <FaThLarge className="text-slate-400 text-sm shrink-0" />
                    <span>Dashboard</span>
                  </Link>

                  {isFreePlan && (
                    <Link
                      href="/pricing"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-pink-400 hover:text-pink-300 hover:bg-pink-500/5 transition cursor-pointer"
                    >
                      <FaBolt className="text-sm shrink-0" />
                      <span>Upgrade Plan</span>
                    </Link>
                  )}

                  <div className="border-t border-white/5 my-1.5" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition cursor-pointer"
                  >
                    <FaSignOutAlt className="text-sm shrink-0 text-red-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-950/98 backdrop-blur-xl px-4 pt-2 pb-4 space-y-0.5">

          {!user && (
            <Link
              href="/login"
              onClick={closeMenu}
              className="block w-full py-2 px-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              Login
            </Link>
          )}

          {mobileNavLink("/", "Home", true)}
          {mobileNavLink("/public-lessons", "Public Lessons")}
          {user && mobileNavLink("/dashboard/user/add-lesson", "Add Lesson")}
          {user && mobileNavLink("/dashboard/user/my-lessons", "My Lessons")}

          {user && isFreePlan && (
            <Link
              href="/pricing"
              onClick={closeMenu}
              className="flex items-center gap-2 w-full py-2 px-3 rounded-xl text-sm font-semibold text-pink-500 bg-pink-500/10 hover:bg-pink-500/15 active:bg-pink-500/20 transition-colors"
            >
              <FaBolt className="text-xs" />
              Upgrade Plan
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}