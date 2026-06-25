"use client";

import { useState, useEffect } from "react";
import YourChartComponent from "@/Component/YourChartComponent";
import Link from "next/link";
import { useSession } from "@/lib/auth-client"; // সেশন থেকে রোল নেওয়ার জন্য
import {
  FaBook,
  FaHeart,
  FaPlus,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

const DashboardHome = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role ? session.user.role.toLowerCase() : "user";

  // ডাইনামিক স্টেটস
  const [stats, setStats] = useState({
    totalLessons: 0,
    favorites: 0,
    recent: [],
  });
  const [loading, setLoading] = useState(true);


 useEffect(() => {
  if (!session?.user?.id || !session?.user?.email) return; 

  const fetchDashboardStats = async () => {
    try {
      // ইউআরএল-এ userId এবং email দুটোই পাস করা হচ্ছে
      const response = await fetch(
        `${SERVER_URL}/api/user/dashboard-summary?userId=${session.user.id}&email=${session.user.email}`
      );
      const data = await response.json();
      
      if (response.ok && data) {
        setStats({
          totalLessons: data.totalLessons || 0,
          favorites: data.favorites || 0,
          recent: data.recentLessons || [],
        });
      }
    } catch (error) {
      console.error("Dashboard stats fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardStats();
}, [session?.user?.id, session?.user?.email]); 
  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Dashboard Overview
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Welcome back, {session?.user?.name || "Learner"}! Here’s your activity summary.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300 text-sm">Total Lessons</h3>
            <FaBook className="text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3">
            {stats.totalLessons}
          </p>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300 text-sm">Favorites</h3>
            <FaHeart className="text-pink-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3">
            {stats.favorites}
          </p>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300 text-sm">Quick Add</h3>
            <FaPlus className="text-green-400" />
          </div>

          {/* আপনার ন্যাভবারের ফোল্ডার স্ট্রাকচার /dashboard/user/add-lesson এর সাথে ম্যাচ করা হয়েছে */}
          <Link
            href={`/dashboard/${userRole}/add-lesson`}
            className="inline-flex items-center gap-2 mt-3 text-sm text-violet-400 hover:text-white transition-colors"
          >
            Create new lesson <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Lessons */}
        <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">
              Recently Added Lessons
            </h2>
            <Link
              href={`/dashboard/${userRole}/my-lessons`}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recent.length === 0 ? (
              <p className="text-slate-500 text-xs py-4">No lessons added yet.</p>
            ) : (
              stats.recent.map((lesson) => (
                <div
                  key={lesson._id || lesson.id}
                  className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 transition flex justify-between items-center group"
                >
                  <p className="text-slate-200 text-sm truncate max-w-[80%]">{lesson.title}</p>
                  <Link href={`/lessons/${lesson._id}`} className="text-xs text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3 text-xs font-semibold">
            <Link
              href={`/dashboard/${userRole}/add-lesson`}
              className="block p-3 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/10 hover:bg-violet-600/20 text-center sm:text-left transition"
            >
              + Add New Lesson
            </Link>

            <Link
              href={`/dashboard/${userRole}/my-favorites`}
              className="block p-3 rounded-xl bg-pink-600/10 text-pink-400 border border-pink-500/10 hover:bg-pink-600/20 text-center sm:text-left transition"
            >
              ❤️ View Favorites
            </Link>

            <Link
              href={`/dashboard/${userRole}/profile`}
              className="block p-3 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/10 hover:bg-blue-600/20 text-center sm:text-left transition"
            >
              👤 Update Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4 text-white font-semibold text-sm">
          <FaChartLine className="text-green-400" />
          Weekly Activity
        </div>

        <div className="w-full">
          <div className="rounded-xl overflow-hidden">
            <YourChartComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;