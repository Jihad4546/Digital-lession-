"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaEye, FaEdit, FaTrash, FaHeart, FaBookmark } from "react-icons/fa";
import { Button, Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export default function MyLessonsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [visibilityLoading, setVisibilityLoading] = useState(null);

  // Delete modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const userEmail = session?.user?.email;

  // ─── Fetch lessons (FIXED: Added clean dependency) ───────────────────────────────
  useEffect(() => {
    if (!userEmail) {
      // সেশন ডাটা না থাকলে এবং সেশন লোড হওয়া শেষ হলে লোডিং ফলস করা
      if (session === null) setLoading(false);
      return;
    }

    const fetchLessons = async () => {
      setLoading(true);
      try {
        const cleanEmail = userEmail.toLowerCase().trim();
        const res = await fetch(`${SERVER_URL}/api/lessons/my/${cleanEmail}`);
        const data = await res.json();

        setLessons(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [userEmail, session]);

  // ─── Delete Actions ──────────────────────────────────────────────────────
  const openDeleteModal = (lesson) => {
    setSelectedLesson(lesson);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedLesson(null);
  };

  const handleDelete = async () => {
    if (!selectedLesson || !userEmail) return;
    setDeletingId(selectedLesson._id);
    try {
      const res = await fetch(
        `${SERVER_URL}/api/lessons/${selectedLesson._id}?email=${userEmail.toLowerCase().trim()}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.deletedCount > 0 || data.success) {
        toast.success("Lesson deleted successfully!");
        setLessons((prev) => prev.filter((l) => l._id !== selectedLesson._id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete failed!");
    } finally {
      setDeletingId(null);
      closeModal();
    }
  };

  // ─── Visibility toggle ───────────────────────────────────────────
  const handleVisibilityChange = async (lessonId, newVisibility) => {
    if (!userEmail) return;
    setVisibilityLoading(lessonId);
    try {
      const res = await fetch(`${SERVER_URL}/api/lessons/${lessonId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visibility: newVisibility,
          email: userEmail.toLowerCase().trim(),
        }),
      });
      const data = await res.json();
      if (data.modifiedCount > 0 || data.success) {
        toast.success(`Visibility updated to ${newVisibility}`);
        setLessons((prev) =>
          prev.map((l) =>
            l._id === lessonId ? { ...l, visibility: newVisibility } : l
          )
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed!");
    } finally {
      setVisibilityLoading(null);
    }
  };

  // ─── Category badge color ────────────────────────────────────────
  const categoryStyle = {
    "Personal Growth": "bg-green-500/10 text-green-400 border-green-500/20",
    Career: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Relationships: "bg-red-500/10 text-red-400 border-red-500/20",
    Mindset: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Mistakes Learned": "bg-slate-500/10 text-slate-300 border-slate-500/20",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" color="secondary" label="Loading your lessons..." />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            My Lessons
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} published by you
          </p>
        </div>
        <Button
          color="secondary"
          className="font-semibold shadow-lg shadow-purple-500/20"
          onPress={() => router.push("/dashboard/user/add-lesson")}
        >
          + Add New Lesson
        </Button>
      </div>

      {/* Main Content */}
      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/40 border border-white/5 rounded-2xl p-6">
          <p className="text-5xl mb-4 animate-bounce">📝</p>
          <h2 className="text-lg font-bold text-white mb-1">No lessons published yet</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-sm">
            Your insights can change someone's mindset. Start your first draft now!
          </p>
          <Button color="secondary" variant="flat" onPress={() => router.push("/dashboard/user/add-lesson")}>
            Create First Lesson
          </Button>
        </div>
      ) : (
        <div className="border border-white/5 rounded-2xl overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-white/5">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Access</th>
                  <th className="p-4 text-left">Visibility</th>
                  <th className="p-4 text-left">Stats</th>
                  <th className="p-4 text-left">Created</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm divide-y divide-white/5">
                {lessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Title */}
                    <td className="p-4 font-semibold text-slate-200 max-w-[200px] truncate">
                      {lesson.title}
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${categoryStyle[lesson.category] || "bg-slate-700/30 text-slate-300"}`}>
                        {lesson.category}
                      </span>
                    </td>

                    {/* Access Level */}
                    <td className="p-4">
                      {lesson.accessLevel === "Premium" ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/10">
                          ⭐ Premium
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/10">
                          Free
                        </span>
                      )}
                    </td>

                    {/* Visibility */}
                    <td className="p-4">
                      {visibilityLoading === lesson._id ? (
                        <Spinner size="sm" color="secondary" />
                      ) : (
                        <select
                          value={lesson.visibility || "Public"}
                          onChange={(e) => handleVisibilityChange(lesson._id, e.target.value)}
                          className="bg-slate-800/80 border border-white/10 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 cursor-pointer focus:outline-none focus:border-purple-500 transition-all outline-none"
                        >
                          <option value="Public" className="bg-slate-900">Public</option>
                          <option value="Private" className="bg-slate-900">Private</option>
                        </select>
                      )}
                    </td>

                    {/* Stats */}
                    <td className="p-4">
                      <div className="flex gap-4 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <FaHeart className="text-rose-400/90" /> {lesson.likesCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBookmark className="text-sky-400/90" /> {lesson.savesCount || 0}
                        </span>
                      </div>
                    </td>

                    {/* Date (FIXED: Duplicated object key syntax resolved) */}
                    <td className="p-4 text-xs text-slate-400 font-medium">
                      {lesson.createdAt
                        ? new Date(lesson.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/lessons/${lesson._id}`}
                          className="p-2 bg-purple-600/10 text-purple-400 hover:bg-purple-600 border border-purple-500/10 hover:text-white rounded-xl transition-all"
                          title="View"
                        >
                          <FaEye size={13} />
                        </Link>
                        <Link
                          href={`/dashboard/user/update-lesson/${lesson._id}`}
                          className="p-2 bg-amber-600/10 text-amber-400 hover:bg-amber-600 border border-amber-500/10 hover:text-white rounded-xl transition-all"
                          title="Edit"
                        >
                          <FaEdit size={13} />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(lesson)}
                          className="p-2 bg-red-600/10 text-red-400 hover:bg-red-600 border border-red-500/10 hover:text-white rounded-xl transition-all"
                          title="Delete"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Modal (FIXED: Clean backdrop with focus locked handler) */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-[90%] max-w-md text-white shadow-2xl transform scale-100 transition-all">
            <h2 className="text-red-400 text-lg font-bold mb-2 flex items-center gap-2">
              ⚠️ Delete Lesson
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="text-slate-100 font-semibold">"{selectedLesson?.title}"</span>?
              This action is permanent and cannot be rolled back.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="flat" size="sm" className="font-semibold" onPress={closeModal}>
                Cancel
              </Button>
              <Button
                color="danger"
                size="sm"
                className="font-semibold shadow-lg shadow-red-500/10"
                isLoading={deletingId === selectedLesson?._id}
                onPress={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}