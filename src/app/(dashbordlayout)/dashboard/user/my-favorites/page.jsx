"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FaEye, FaTrash } from "react-icons/fa";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export default function MyFavoritesPage() {
  const { data: session } = authClient.useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterTone, setFilterTone] = useState("All");

  // ─── ১. ডাটাবেজ থেকে ফেভারিট ডেটা ফেচ করা (FIXED: Safe Dependency) ──────────────────────
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/lessons/favorites/${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setFavorites(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchFavorites();
    } else {
      // সেশন চেক শেষ না হওয়া পর্যন্ত লোডিং অফ হবে না
      if (session === null) setLoading(false);
    }
  }, [session?.user?.id]); // FIXED: অবজেক্টের বদলে স্পেসিফিক আইডি ট্র্যাকিং করা হয়েছে

  // ─── ২. ফেভারিট লিস্ট থেকে রিমুভ করা (সার্ভার সিঙ্কসহ) ───────────
  const removeFavorite = async (id) => {
    if (!session?.user?.id) return;

    // অপটিমিস্টিক আপডেট (ইউজারের সুবিধার্থে সাথে সাথে স্ক্রিন থেকে সরানো)
    const previousFavorites = [...favorites];
    setFavorites((prev) => prev.filter((item) => item._id !== id));

    try {
      const res = await fetch(`${SERVER_URL}/api/lessons/${id}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (res.ok) {
        toast.success("Removed from favorites");
      } else {
        throw new Error();
      }
    } catch (err) {
      // ফেইল হলে আগের স্টেট ফেরত আনা
      setFavorites(previousFavorites);
      toast.error("Could not remove from favorites");
    }
  };

  // ─── ৩. ফিল্টারিং লজিক ─────────────────────────────────────────
  const filteredFavorites = favorites.filter((item) => {
    const categoryMatch =
      filterCategory === "All" || item.category === filterCategory;

    const itemTone = item.emotionalTone || item.tone;
    const toneMatch =
      filterTone === "All" || itemTone === filterTone;

    return categoryMatch && toneMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-t-transparent border-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-8 text-center bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl max-w-xl mx-auto mt-10">
        ⚠️ Please log in to see your saved favorites.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto text-white">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          My Favorites
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage and read the lessons you saved.</p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mt-6 bg-slate-900/40 p-4 border border-white/5 rounded-2xl">
        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-200 outline-none border border-white/5 focus:border-pink-500 transition text-xs sm:text-sm min-w-[160px]"
          >
            <option className="bg-slate-900">All</option>
            <option className="bg-slate-900">Mindset</option>
            <option className="bg-slate-900">Career</option>
            <option className="bg-slate-900">Relationships</option>
            <option className="bg-slate-900">Personal Growth</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tone</label>
          <select
            value={filterTone}
            onChange={(e) => setFilterTone(e.target.value)}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-200 outline-none border border-white/5 focus:border-pink-500 transition text-xs sm:text-sm min-w-[160px]"
          >
            <option className="bg-slate-900">All</option>
            <option className="bg-slate-900">Motivational</option>
            <option className="bg-slate-900">Sad</option>
            <option className="bg-slate-900">Realization</option>
            <option className="bg-slate-900">Gratitude</option>
          </select>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="mt-6 border border-white/5 rounded-2xl overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-white/5">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Emotion</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-left">Saves</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-white/5">
              {filteredFavorites.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-12 text-slate-500 font-medium">
                    No favorites match your selected filters.
                  </td>
                </tr>
              ) : (
                filteredFavorites.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 font-semibold text-slate-200 max-w-[240px] truncate">
                      {item.title}
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/10">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {item.emotionalTone || item.tone}
                    </td>
                    <td className="p-4 text-slate-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : "N/A"}
                    </td>
                    <td className="p-4 text-slate-400 font-medium pl-6">
                      {item.favoritesCount || item.saves || 0}
                    </td>

                    {/* ACTIONS (FIXED: Wrapped layout fix) */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/lessons/${item._id}`}
                          className="p-2 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600 border border-blue-500/10 hover:text-white transition-all"
                          title="View Lesson"
                        >
                          <FaEye size={14} />
                        </Link>

                        <button
                          onClick={() => removeFavorite(item._id)}
                          className="p-2 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600 border border-red-500/10 hover:text-white transition-all"
                          title="Remove from favorites"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}