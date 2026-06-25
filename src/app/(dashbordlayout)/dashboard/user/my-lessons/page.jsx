"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaEye, FaEdit, FaTrash, FaHeart, FaBookmark } from "react-icons/fa";
import { Button, Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client"; // Better Auth

// 1. SERVER_URL এর একটি fallback (বিকল্প) দেওয়া হলো যেন undefined না হয়
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

  // ─── Fetch lessons ───────────────────────────────────────────────
  useEffect(() => {
    if (!userEmail) return;

    const fetchLessons = async () => {
      setLoading(true);
      try {
        // 2. ইমেইলটি ছোট হাতের (lowercase) করে পাঠানো হচ্ছে ডাটাবেসের সাথে ম্যাচ করার জন্য
        const cleanEmail = userEmail.toLowerCase().trim();
        console.log("Fetching from:", `${SERVER_URL}/api/lessons/my/${cleanEmail}`);

        const res = await fetch(`${SERVER_URL}/api/lessons/my/${cleanEmail}`);
        const data = await res.json();

        console.log("Fetched data from DB:", data);

        // নিশ্চিত হওয়া যে ডাটাটি একটি Array
        setLessons(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [userEmail]);

  // ─── Delete ──────────────────────────────────────────────────────
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
      // 3. ব্যাকএন্ডের verifyOwner এর জন্য query parameter হিসেবে email পাঠানো হলো
      const res = await fetch(`${SERVER_URL}/api/lessons/${selectedLesson._id}?email=${userEmail.toLowerCase().trim()}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.deletedCount > 0) {
        toast.success("Lesson deleted!");
        setLessons((prev) => prev.filter((l) => l._id !== selectedLesson._id));
      }
    } catch {
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
      // 4. ব্যাকএন্ডের verifyOwner এর জন্য body তে email পাঠানো হলো
      const res = await fetch(`${SERVER_URL}/api/lessons/${lessonId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visibility: newVisibility,
          email: userEmail.toLowerCase().trim()
        }),
      });
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success(`Visibility → ${newVisibility}`);
        setLessons((prev) =>
          prev.map((l) =>
            l._id === lessonId ? { ...l, visibility: newVisibility } : l
          )
        );
      }
    } catch {
      toast.error("Update failed!");
    } finally {
      setVisibilityLoading(null);
    }
  };

  // ─── Category badge color ────────────────────────────────────────
  const categoryStyle = {
    "Personal Growth": "bg-green-900/30 text-green-400",
    Career: "bg-blue-900/30 text-blue-400",
    Relationships: "bg-red-900/30 text-red-400",
    Mindset: "bg-purple-900/30 text-purple-400",
    "Mistakes Learned": "bg-slate-700/50 text-slate-300",
  };

  // ─── Loading ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" color="secondary" label="Loading lessons..." />
      </div>
    );
  }

  // ─── UI ──────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 text-white">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Lessons</h1>
          <p className="text-sm text-slate-400 mt-1">
            {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Button
          color="secondary"
          onPress={() => router.push("/dashboard/user/add-lesson")}
        >
          + Add New Lesson
        </Button>
      </div>

      {/* Empty state */}
      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
          <p className="text-5xl mb-4">📝</p>
          <h2 className="text-lg font-semibold text-white mb-2">No lessons yet</h2>
          <p className="mb-6">Start sharing your wisdom with the world!</p>
          <Button color="secondary" onPress={() => router.push("/dashboard/user/add-lesson")}>
            Create First Lesson
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">

            <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Access</th>
                <th className="p-3 text-left">Visibility</th>
                <th className="p-3 text-left">Stats</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {lessons.map((lesson) => (
                <tr
                  key={lesson._id}
                  className="border-t border-white/5 hover:bg-slate-800/40 transition-colors"
                >
                  {/* Title */}
                  <td className="p-3 font-medium max-w-[180px] truncate">
                    {lesson.title}
                  </td>

                  {/* Category */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryStyle[lesson.category] || "bg-slate-700 text-slate-300"}`}>
                      {lesson.category}
                    </span>
                  </td>

                  {/* Access Level */}
                  <td className="p-3">
                    {lesson.accessLevel === "Premium" ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400">
                        ⭐ Premium
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                        Free
                      </span>
                    )}
                  </td>

                  {/* Visibility Toggle */}
                  <td className="p-3">
                    {visibilityLoading === lesson._id ? (
                      <Spinner size="sm" />
                    ) : (
                      <select
                        value={lesson.visibility}
                        onChange={(e) =>
                          handleVisibilityChange(lesson._id, e.target.value)
                        }
                        className="bg-slate-800 border border-white/10 text-white text-xs rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                      >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </select>
                    )}
                  </td>

                  {/* Stats */}
                  <td className="p-3">
                    <div className="flex gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <FaHeart className="text-rose-400" /> {lesson.likesCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaBookmark className="text-blue-400" /> {lesson.savesCount || 0}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="p-3 text-xs text-slate-400">
                    {new Date(lesson.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      day: "numeric"
                    })}
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/lessons/${lesson._id}`}
                        className="p-2 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg transition-colors"
                        title="View"
                      >
                        <FaEye className="text-purple-400" />
                      </Link>
                      <Link
                        href={`/dashboard/user/update-lesson/${lesson._id}`}
                        className="p-2 bg-yellow-600/20 hover:bg-yellow-600/40 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="text-yellow-400" />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(lesson)}
                        className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-[90%] max-w-md text-white">
            <h2 className="text-red-400 text-lg font-bold mb-2">Delete Lesson</h2>
            <p className="text-slate-400 text-sm">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">"{selectedLesson?.title}"</span>?
              This cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="flat" onPress={closeModal}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={!!deletingId}
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