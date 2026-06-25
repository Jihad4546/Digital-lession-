"use client";

import YourChartComponent from "@/Component/YourChartComponent";
import Link from "next/link";
import {
  FaBook,
  FaHeart,
  FaPlus,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

const DashboardHome = () => {
  // dummy data (backend লাগালে replace করবে)
  const stats = {
    totalLessons: 24,
    favorites: 12,
    recent: [
      { id: 1, title: "Life Lesson about Consistency" },
      { id: 2, title: "Failure teaches success" },
      { id: 3, title: "Discipline is freedom" },
    ],
  };

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Dashboard Overview
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Welcome back! Here’s your activity summary.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300">Total Lessons</h3>
            <FaBook className="text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3">
            {stats.totalLessons}
          </p>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300">Favorites</h3>
            <FaHeart className="text-pink-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3">
            {stats.favorites}
          </p>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300">Quick Add</h3>
            <FaPlus className="text-green-400" />
          </div>

          <Link
            href="/dashboard/add-lesson"
            className="inline-flex items-center gap-2 mt-3 text-violet-400 hover:text-white"
          >
            Create new lesson <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Lessons */}
        <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">
              Recently Added Lessons
            </h2>
            <Link
              href="/dashboard/my-lessons"
              className="text-sm text-slate-400 hover:text-white"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recent.map((lesson) => (
              <div
                key={lesson.id}
                className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 transition"
              >
                <p className="text-slate-200">{lesson.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <Link
              href="/dashboard/add-lesson"
              className="block p-3 rounded-xl bg-violet-600/20 text-violet-300 hover:bg-violet-600/30"
            >
              + Add New Lesson
            </Link>

            <Link
              href="/dashboard/my-favorites"
              className="block p-3 rounded-xl bg-pink-600/20 text-pink-300 hover:bg-pink-600/30"
            >
              ❤️ View Favorites
            </Link>

            <Link
              href="/dashboard/profile"
              className="block p-3 rounded-xl bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
            >
              👤 Update Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4 text-white font-semibold">
          <FaChartLine className="text-green-400" />
          Weekly Activity
        </div>

        {/* Chart Widget */}
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