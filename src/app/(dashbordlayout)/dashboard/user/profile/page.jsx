"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaCrown } from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Jahid Hosen",
    email: "jahid@email.com",
    photo: "",
    isPremium: true,
    totalLessons: 12,
    totalFavorites: 7,
  });

  const [editName, setEditName] = useState(user.name);
  const [editPhoto, setEditPhoto] = useState(user.photo);

  const [myLessons] = useState([
    {
      id: 1,
      title: "Consistency builds success",
      category: "Mindset",
      createdAt: "2026-06-20",
    },
    {
      id: 2,
      title: "Failure is a teacher",
      category: "Career",
      createdAt: "2026-06-18",
    },
  ]);

  // SAVE PROFILE UPDATE
  const handleUpdate = () => {
    setUser({
      ...user,
      name: editName,
      photo: editPhoto,
    });

    toast.success("Profile updated successfully");
  };

  return (
    <div className="p-4 md:p-6 text-white">

      {/* HEADER */}
      <h1 className="text-2xl md:text-3xl font-bold">
        My Profile
      </h1>

      {/* PROFILE CARD */}
      <div className="mt-6 bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6">

        {/* PHOTO */}
        <div className="w-24 h-24 rounded-full bg-slate-800 overflow-hidden">
          {editPhoto ? (
            <Image
              src={editPhoto}
              alt="profile"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No Photo
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="flex-1 space-y-2">

          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{user.name}</h2>

            {user.isPremium && (
              <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                <FaCrown /> Premium
              </span>
            )}
          </div>

          <p className="text-slate-400">{user.email}</p>

          {/* STATS */}
          <div className="flex gap-4 mt-3 text-sm text-slate-300">
            <span>📚 {user.totalLessons} Lessons</span>
            <span>❤️ {user.totalFavorites} Favorites</span>
          </div>

          {/* EDIT FORM */}
          <div className="mt-4 flex flex-col md:flex-row gap-2">

            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="p-2 rounded bg-slate-800 w-full"
              placeholder="Update name"
            />

            <input
              value={editPhoto}
              onChange={(e) => setEditPhoto(e.target.value)}
              className="p-2 rounded bg-slate-800 w-full"
              placeholder="Photo URL"
            />

            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded bg-violet-600 hover:bg-violet-700"
            >
              Save
            </button>

          </div>

        </div>
      </div>

      {/* USER LESSONS */}
      <h2 className="mt-8 text-xl font-semibold">
        My Public Lessons
      </h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">

        {myLessons
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((lesson) => (
            <div
              key={lesson.id}
              className="bg-slate-900 border border-white/5 rounded-2xl p-4 hover:bg-slate-800/40 transition"
            >
              <h3 className="font-semibold">{lesson.title}</h3>
              <p className="text-sm text-slate-400 mt-1">
                {lesson.category}
              </p>

              <p className="text-xs text-slate-500 mt-2">
                {lesson.createdAt}
              </p>
            </div>
          ))}

      </div>

    </div>
  );
}