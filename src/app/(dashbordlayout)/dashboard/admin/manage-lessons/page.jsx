"use client";

import { useState } from "react";
import { Card, Input, Avatar, Button, Chip } from "@heroui/react";
import { FaSearch, FaTrash, FaStar, FaCheckCircle, FaFlag, FaEye, FaLock, FaGlobe } from "react-icons/fa";

const lessons = [
  {
    _id: 1,
    title: "Mastering Time Management",
    category: "Productivity",
    author: { name: "Jahid Hosen", image: "https://i.pravatar.cc/150?img=1" },
    visibility: "public",
    flagged: false,
    featured: false,
    reviewed: true,
    thumbnail: "https://picsum.photos/seed/lesson1/80/60",
  },
  {
    _id: 2,
    title: "Digital Minimalism Guide",
    category: "Lifestyle",
    author: { name: "Siam Ahmed", image: "https://i.pravatar.cc/150?img=2" },
    visibility: "private",
    flagged: true,
    featured: false,
    reviewed: false,
    thumbnail: "https://picsum.photos/seed/lesson2/80/60",
  },
  {
    _id: 3,
    title: "Morning Routine Secrets",
    category: "Health",
    author: { name: "Rahat Islam", image: "https://i.pravatar.cc/150?img=3" },
    visibility: "public",
    flagged: false,
    featured: true,
    reviewed: true,
    thumbnail: "https://picsum.photos/seed/lesson3/80/60",
  },
  {
    _id: 4,
    title: "Financial Freedom Basics",
    category: "Finance",
    author: { name: "Nadia Parvin", image: "https://i.pravatar.cc/150?img=4" },
    visibility: "public",
    flagged: true,
    reviewed: false,
    featured: false,
    thumbnail: "https://picsum.photos/seed/lesson4/80/60",
  },
  {
    _id: 5,
    title: "Deep Work Techniques",
    category: "Productivity",
    author: { name: "Tanvir Hasan", image: "https://i.pravatar.cc/150?img=5" },
    visibility: "private",
    flagged: false,
    featured: false,
    reviewed: false,
    thumbnail: "https://picsum.photos/seed/lesson5/80/60",
  },
];

const categories = ["All", "Productivity", "Lifestyle", "Health", "Finance"];

export default function ManageLessonsPage() {
  const [data, setData] = useState(lessons);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [flagFilter, setFlagFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const filtered = data.filter((l) => {
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.author.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || l.category === categoryFilter;
    const matchVis = visibilityFilter === "all" || l.visibility === visibilityFilter;
    const matchFlag =
      flagFilter === "all" || (flagFilter === "flagged" ? l.flagged : !l.flagged);
    return matchSearch && matchCat && matchVis && matchFlag;
  });

  const confirmDelete = (lesson) => {
    setDeleteTarget(lesson);
    setShowConfirm(true);
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((l) => l._id !== deleteTarget._id));
    setShowConfirm(false);
    setDeleteTarget(null);
  };

  const toggleFeatured = (id) => {
    setData((prev) =>
      prev.map((l) => (l._id === id ? { ...l, featured: !l.featured } : l))
    );
  };

  const toggleReviewed = (id) => {
    setData((prev) =>
      prev.map((l) => (l._id === id ? { ...l, reviewed: !l.reviewed } : l))
    );
  };

  const publicCount = data.filter((l) => l.visibility === "public").length;
  const privateCount = data.filter((l) => l.visibility === "private").length;
  const flaggedCount = data.filter((l) => l.flagged).length;

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <Card className="p-6">
        <h1 className="text-3xl font-bold">📚 Manage Lessons</h1>
        <p className="text-default-500 mt-1">Review, feature, and moderate all lessons</p>
      </Card>

      {/* STATS */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-5 border-l-4 border-success">
          <div className="flex items-center gap-3">
            <FaGlobe className="text-success text-2xl" />
            <div>
              <p className="text-default-500 text-sm">Public Lessons</p>
              <h2 className="text-3xl font-bold">{publicCount}</h2>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-default-400">
          <div className="flex items-center gap-3">
            <FaLock className="text-default-400 text-2xl" />
            <div>
              <p className="text-default-500 text-sm">Private Lessons</p>
              <h2 className="text-3xl font-bold">{privateCount}</h2>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-danger">
          <div className="flex items-center gap-3">
            <FaFlag className="text-danger text-2xl" />
            <div>
              <p className="text-default-500 text-sm">Flagged Content</p>
              <h2 className="text-3xl font-bold">{flaggedCount}</h2>
            </div>
          </div>
        </Card>
      </div>

      {/* FILTERS */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search lessons or authors..."
            startContent={<FaSearch />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <select
            className="border rounded-xl px-4 py-2 md:w-44"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="border rounded-xl px-4 py-2 md:w-44"
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
          >
            <option value="all">All Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <select
            className="border rounded-xl px-4 py-2 md:w-44"
            value={flagFilter}
            onChange={(e) => setFlagFilter(e.target.value)}
          >
            <option value="all">All Flags</option>
            <option value="flagged">Flagged</option>
            <option value="clean">Clean</option>
          </select>
        </div>
      </Card>

      {/* TABLE */}
      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-default-200 text-default-500 text-left">
                <th className="pb-3 pr-4 font-medium">LESSON</th>
                <th className="pb-3 pr-4 font-medium">AUTHOR</th>
                <th className="pb-3 pr-4 font-medium">CATEGORY</th>
                <th className="pb-3 pr-4 font-medium">STATUS</th>
                <th className="pb-3 pr-4 font-medium">FLAGS</th>
                <th className="pb-3 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-default-400">
                    No lessons found.
                  </td>
                </tr>
              ) : (
                filtered.map((lesson) => (
                  <tr
                    key={lesson._id}
                    className="border-b border-default-100 hover:bg-default-50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={lesson.thumbnail}
                          alt={lesson.title}
                          className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <p className="font-medium leading-tight">{lesson.title}</p>
                          {lesson.featured && (
                            <span className="text-xs text-warning font-medium flex items-center gap-1 mt-0.5">
                              <FaStar className="text-warning" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar src={lesson.author.image} size="sm" />
                        <span className="whitespace-nowrap">{lesson.author.name}</span>
                      </div>
                    </td>

                    <td className="py-3 pr-4">
                      <Chip variant="flat" size="sm">{lesson.category}</Chip>
                    </td>

                    <td className="py-3 pr-4">
                      <div className="flex flex-col gap-1">
                        <Chip
                          size="sm"
                          variant="flat"
                          color={lesson.visibility === "public" ? "success" : "default"}
                          startContent={lesson.visibility === "public" ? <FaGlobe /> : <FaLock />}
                        >
                          {lesson.visibility}
                        </Chip>
                        {lesson.reviewed && (
                          <Chip size="sm" variant="flat" color="primary" startContent={<FaCheckCircle />}>
                            Reviewed
                          </Chip>
                        )}
                      </div>
                    </td>

                    <td className="py-3 pr-4">
                      {lesson.flagged ? (
                        <Chip size="sm" variant="flat" color="danger" startContent={<FaFlag />}>
                          Flagged
                        </Chip>
                      ) : (
                        <span className="text-default-400 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          color={lesson.featured ? "warning" : "default"}
                          startContent={<FaStar />}
                          onPress={() => toggleFeatured(lesson._id)}
                        >
                          {lesson.featured ? "Unfeature" : "Feature"}
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color={lesson.reviewed ? "primary" : "default"}
                          startContent={lesson.reviewed ? <FaCheckCircle /> : <FaEye />}
                          onPress={() => toggleReviewed(lesson._id)}
                        >
                          {lesson.reviewed ? "Reviewed" : "Mark Reviewed"}
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          isIconOnly
                          onPress={() => confirmDelete(lesson)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DELETE CONFIRMATION POPUP */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-default-100 rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-danger mb-2">🗑️ Delete Lesson</h2>
            <p className="text-default-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{deleteTarget?.title}"</span>?
            </p>
            <p className="text-default-500 text-sm mt-1">This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="flat" onPress={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDelete}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}