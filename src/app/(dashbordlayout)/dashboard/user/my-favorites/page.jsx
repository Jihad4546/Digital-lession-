"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaEye, FaTrash } from "react-icons/fa";

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: "Consistency builds success",
      category: "Mindset",
      tone: "Motivational",
      createdAt: "2026-06-10",
      saves: 15,
    },
    {
      id: 2,
      title: "Failure teaches everything",
      category: "Career",
      tone: "Realization",
      createdAt: "2026-06-12",
      saves: 9,
    },
  ]);

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterTone, setFilterTone] = useState("All");

  // REMOVE FAVORITE
  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
    toast.success("Removed from favorites");
  };

  // FILTER LOGIC
  const filteredFavorites = favorites.filter((item) => {
    const categoryMatch =
      filterCategory === "All" || item.category === filterCategory;

    const toneMatch =
      filterTone === "All" || item.tone === filterTone;

    return categoryMatch && toneMatch;
  });

  return (
    <div className="p-4 md:p-6 text-white">

      {/* HEADER */}
      <h1 className="text-2xl md:text-3xl font-bold">
        My Favorites
      </h1>
      <p className="text-slate-400 mt-1">
        Saved lessons you love
      </p>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-3 mt-6">

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 rounded bg-slate-800 text-white"
        >
          <option>All</option>
          <option>Mindset</option>
          <option>Career</option>
          <option>Relationships</option>
          <option>Personal Growth</option>
        </select>

        <select
          value={filterTone}
          onChange={(e) => setFilterTone(e.target.value)}
          className="p-2 rounded bg-slate-800 text-white"
        >
          <option>All</option>
          <option>Motivational</option>
          <option>Sad</option>
          <option>Realization</option>
          <option>Gratitude</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[800px] bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">

          <thead className="bg-slate-800 text-slate-300 text-sm">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th>Category</th>
              <th>Emotion</th>
              <th>Created</th>
              <th>Saves</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredFavorites.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-slate-400">
                  No favorites found
                </td>
              </tr>
            ) : (
              filteredFavorites.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-white/5 hover:bg-slate-800/40"
                >
                  <td className="p-3">{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.tone}</td>
                  <td>{item.createdAt}</td>
                  <td>{item.saves}</td>

                  {/* ACTIONS */}
                  <td className="flex gap-2 p-2">

                    {/* VIEW */}
                    <Link
                      href={`/dashboard/my-lessons/${item.id}`}
                      className="p-2 rounded bg-blue-600/20 hover:bg-blue-600/40"
                    >
                      <FaEye />
                    </Link>

                    {/* REMOVE FAVORITE */}
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="p-2 rounded bg-red-600/20 hover:bg-red-600/40"
                    >
                      <FaTrash />
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}