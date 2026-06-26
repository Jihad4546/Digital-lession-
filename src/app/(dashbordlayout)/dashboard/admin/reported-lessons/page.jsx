"use client";

import { useState, useEffect } from "react";
import { Card, Input, Avatar, Button, Chip } from "@heroui/react";
import { FaSearch, FaTrash, FaFlag, FaEye, FaTimes, FaCheck } from "react-icons/fa";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ReportedLessonsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch
  useEffect(() => {
    fetch(`${API}/api/admin/reported-lessons`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter
  const filtered = data.filter(l =>
    l.title?.toLowerCase().includes(search.toLowerCase()) ||
    l.creatorName?.toLowerCase().includes(search.toLowerCase())
  );

  // Ignore
  const handleIgnore = async (id) => {
    await fetch(`${API}/api/admin/lessons/${id}/ignore`, { method: "PATCH" });
    setData(prev => prev.filter(l => l._id !== id));
    if (selectedLesson?._id === id) setSelectedLesson(null);
  };

  // Delete confirm
  const confirmDelete = (lesson) => {
    setDeleteTarget(lesson);
    setShowDeleteConfirm(true);
  };

  // Delete — null-guard fix
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const idToDelete = deleteTarget._id;        // ✅ আগেই capture
    setShowDeleteConfirm(false);
    setDeleteTarget(null);

    await fetch(`${API}/api/admin/lessons/${idToDelete}`, { method: "DELETE" });
    setData(prev => prev.filter(l => l._id !== idToDelete));
    if (selectedLesson?._id === idToDelete) setSelectedLesson(null);
  };

  const getSeverityColor = (count) => {
    if (count >= 4) return "danger";
    if (count >= 2) return "warning";
    return "default";
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <Card className="p-6">
        <h1 className="text-3xl font-bold">🚩 Reported Lessons</h1>
        <p className="text-default-500 mt-1">Review flagged content and take action</p>
      </Card>

      {/* STATS */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-5 border-l-4 border-danger">
          <p className="text-default-500 text-sm">Total Reported</p>
          <h2 className="text-3xl font-bold">{data.length}</h2>
        </Card>
        <Card className="p-5 border-l-4 border-warning">
          <p className="text-default-500 text-sm">High Priority (4+ reports)</p>
          <h2 className="text-3xl font-bold">
            {data.filter(l => l.reports?.length >= 4).length}
          </h2>
        </Card>
        <Card className="p-5 border-l-4 border-default-400">
          <p className="text-default-500 text-sm">Total Reports</p>
          <h2 className="text-3xl font-bold">
            {data.reduce((sum, l) => sum + (l.reports?.length ?? 0), 0)}
          </h2>
        </Card>
      </div>

      {/* SEARCH */}
      <Card className="p-5">
        <Input
          placeholder="Search by lesson title or author..."
          startContent={<FaSearch />}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
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
                <th className="pb-3 pr-4 font-medium">REPORTS</th>
                <th className="pb-3 pr-4 font-medium">REASONS</th>
                <th className="pb-3 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-default-400">
                    No reported lessons found.
                  </td>
                </tr>
              ) : (
                filtered.map(lesson => (
                  <tr key={lesson._id} className="border-b border-default-100 hover:bg-default-50 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-medium">{lesson.title}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar src={lesson.creatorImage} size="sm" />
                        <span className="whitespace-nowrap">{lesson.creatorName}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Chip variant="flat" size="sm">{lesson.category}</Chip>
                    </td>
                    <td className="py-3 pr-4">
                      <Chip
                        variant="flat"
                        size="sm"
                        color={getSeverityColor(lesson.reports?.length ?? 0)}
                        startContent={<FaFlag />}
                      >
                        {lesson.reports?.length ?? 0} report{lesson.reports?.length !== 1 ? "s" : ""}
                      </Chip>
                    </td>
                    <td className="py-3 pr-4">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<FaEye />}
                        onPress={() => setSelectedLesson(lesson)}
                      >
                        View Reasons
                      </Button>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button size="sm" color="danger" startContent={<FaTrash />} onPress={() => confirmDelete(lesson)}>
                          Delete
                        </Button>
                        <Button size="sm" variant="flat" color="success" startContent={<FaCheck />} onPress={() => handleIgnore(lesson._id)}>
                          Ignore
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

      {/* REASONS MODAL */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-default-100 rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-default-200">
              <div>
                <h2 className="text-lg font-bold">Report Details</h2>
                <p className="text-default-500 text-sm mt-0.5 line-clamp-1">{selectedLesson.title}</p>
              </div>
              <button onClick={() => setSelectedLesson(null)} className="text-default-400 hover:text-default-700 transition-colors p-1">
                <FaTimes size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-96 overflow-y-auto">
              {selectedLesson.reports?.length > 0 ? (
                selectedLesson.reports.map((report, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-default-50 border border-default-100">
                    <Avatar src={report.reporterImage} size="sm" className="flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm">{report.reporterName}</p>
                        <span className="text-xs text-default-400 whitespace-nowrap">
                          {new Date(report.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-default-600 mt-0.5">{report.reason}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-default-400 text-sm text-center">No report details available.</p>
              )}
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-default-200">
              <Button variant="flat" color="success" startContent={<FaCheck />}
                onPress={() => { const id = selectedLesson._id; setSelectedLesson(null); handleIgnore(id); }}>
                Ignore All Reports
              </Button>
              <Button color="danger" startContent={<FaTrash />}
                onPress={() => { setSelectedLesson(null); confirmDelete(selectedLesson); }}>
                Delete Lesson
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-default-100 rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-danger mb-2">🗑️ Delete Lesson</h2>
            <p className="text-default-700">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold">"{deleteTarget?.title}"</span>?
            </p>
            <p className="text-default-500 text-sm mt-1">This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="flat" onPress={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button color="danger" onPress={handleDelete}>Yes, Delete</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}