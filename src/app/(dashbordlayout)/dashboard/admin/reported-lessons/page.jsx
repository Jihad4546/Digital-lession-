"use client";

import { useState } from "react";
import { Card, Input, Avatar, Button, Chip } from "@heroui/react";
import { FaSearch, FaTrash, FaFlag, FaEye, FaTimes, FaCheck } from "react-icons/fa";

const reportedLessons = [
    {
        _id: 1,
        title: "Mastering Time Management",
        author: { name: "Jahid Hosen", image: "https://i.pravatar.cc/150?img=1" },
        category: "Productivity",
        reports: [
            { reporter: { name: "Siam Ahmed", image: "https://i.pravatar.cc/150?img=2" }, reason: "Misleading information", date: "2025-06-01" },
            { reporter: { name: "Nadia Parvin", image: "https://i.pravatar.cc/150?img=4" }, reason: "Spam content", date: "2025-06-03" },
            { reporter: { name: "Tanvir Hasan", image: "https://i.pravatar.cc/150?img=5" }, reason: "Inappropriate language", date: "2025-06-05" },
        ],
    },
    {
        _id: 2,
        title: "Digital Minimalism Guide",
        author: { name: "Rahat Islam", image: "https://i.pravatar.cc/150?img=3" },
        category: "Lifestyle",
        reports: [
            { reporter: { name: "Jahid Hosen", image: "https://i.pravatar.cc/150?img=1" }, reason: "Plagiarized content", date: "2025-06-07" },
            { reporter: { name: "Siam Ahmed", image: "https://i.pravatar.cc/150?img=2" }, reason: "False claims", date: "2025-06-08" },
        ],
    },
    {
        _id: 3,
        title: "Financial Freedom Basics",
        author: { name: "Nadia Parvin", image: "https://i.pravatar.cc/150?img=4" },
        category: "Finance",
        reports: [
            { reporter: { name: "Rahat Islam", image: "https://i.pravatar.cc/150?img=3" }, reason: "Scam / fraudulent advice", date: "2025-06-10" },
            { reporter: { name: "Tanvir Hasan", image: "https://i.pravatar.cc/150?img=5" }, reason: "Misleading information", date: "2025-06-11" },
            { reporter: { name: "Siam Ahmed", image: "https://i.pravatar.cc/150?img=2" }, reason: "Spam content", date: "2025-06-12" },
            { reporter: { name: "Jahid Hosen", image: "https://i.pravatar.cc/150?img=1" }, reason: "Hate speech", date: "2025-06-13" },
        ],
    },
    {
        _id: 4,
        title: "Morning Routine Secrets",
        author: { name: "Tanvir Hasan", image: "https://i.pravatar.cc/150?img=5" },
        category: "Health",
        reports: [
            { reporter: { name: "Nadia Parvin", image: "https://i.pravatar.cc/150?img=4" }, reason: "Dangerous health advice", date: "2025-06-14" },
        ],
    },
];

export default function ReportedLessonsPage() {
    const [data, setData] = useState(reportedLessons);
    const [search, setSearch] = useState("");
    const [selectedLesson, setSelectedLesson] = useState(null);

    // delete confirm state
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const filtered = data.filter(
        (l) =>
            l.title.toLowerCase().includes(search.toLowerCase()) ||
            l.author.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleIgnore = (id) => {
        setData((prev) => prev.filter((l) => l._id !== id));
        if (selectedLesson?._id === id) setSelectedLesson(null);
    };

    const confirmDelete = (lesson) => {
        setDeleteTarget(lesson);
        setShowDeleteConfirm(true);
    };

    const handleDelete = () => {
        setData((prev) => prev.filter((l) => l._id !== deleteTarget._id));
        if (selectedLesson?._id === deleteTarget._id) setSelectedLesson(null);
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
    };

    const getSeverityColor = (count) => {
        if (count >= 4) return "danger";
        if (count >= 2) return "warning";
        return "default";
    };

    return (
        <div className="space-y-6 p-6">

            {/* HEADER */}
            <Card className="p-6">
                <h1 className="text-3xl font-bold">🚩 Reported Lessons</h1>
                <p className="text-default-500 mt-1">
                    Review flagged content and take action
                </p>
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
                        {data.filter((l) => l.reports.length >= 4).length}
                    </h2>
                </Card>
                <Card className="p-5 border-l-4 border-default-400">
                    <p className="text-default-500 text-sm">Total Reports</p>
                    <h2 className="text-3xl font-bold">
                        {data.reduce((sum, l) => sum + l.reports.length, 0)}
                    </h2>
                </Card>
            </div>

            {/* SEARCH */}
            <Card className="p-5">
                <Input
                    placeholder="Search by lesson title or author..."
                    startContent={<FaSearch />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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
                                filtered.map((lesson) => (
                                    <tr
                                        key={lesson._id}
                                        className="border-b border-default-100 hover:bg-default-50 transition-colors"
                                    >
                                        {/* LESSON */}
                                        <td className="py-3 pr-4">
                                            <p className="font-medium">{lesson.title}</p>
                                        </td>

                                        {/* AUTHOR */}
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar src={lesson.author.image} size="sm" />
                                                <span className="whitespace-nowrap">{lesson.author.name}</span>
                                            </div>
                                        </td>

                                        {/* CATEGORY */}
                                        <td className="py-3 pr-4">
                                            <Chip variant="flat" size="sm">{lesson.category}</Chip>
                                        </td>

                                        {/* REPORT COUNT */}
                                        <td className="py-3 pr-4">
                                            <Chip
                                                variant="flat"
                                                size="sm"
                                                color={getSeverityColor(lesson.reports.length)}
                                                startContent={<FaFlag />}
                                            >
                                                {lesson.reports.length} report{lesson.reports.length > 1 ? "s" : ""}
                                            </Chip>
                                        </td>

                                        {/* VIEW REASONS */}
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

                                        {/* ACTIONS */}
                                        <td className="py-3">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    startContent={<FaTrash />}
                                                    onPress={() => confirmDelete(lesson)}
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="success"
                                                    startContent={<FaCheck />}
                                                    onPress={() => handleIgnore(lesson._id)}
                                                >
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

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-default-200">
                            <div>
                                <h2 className="text-lg font-bold">Report Details</h2>
                                <p className="text-default-500 text-sm mt-0.5 line-clamp-1">
                                    {selectedLesson.title}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedLesson(null)}
                                className="text-default-400 hover:text-default-700 transition-colors p-1"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-3 max-h-96 overflow-y-auto">
                            {selectedLesson.reports.map((report, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-xl bg-default-50 border border-default-100"
                                >
                                    <Avatar src={report.reporter.image} size="sm" className="flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-medium text-sm">{report.reporter.name}</p>
                                            <span className="text-xs text-default-400 whitespace-nowrap">{report.date}</span>
                                        </div>
                                        <p className="text-sm text-default-600 mt-0.5">{report.reason}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-5 border-t border-default-200">
                            <Button
                                variant="flat"
                                color="success"
                                startContent={<FaCheck />}
                                onPress={() => {
                                    const id = selectedLesson._id;
                                    setSelectedLesson(null);
                                    handleIgnore(id);
                                }}
                            >
                                Ignore All Reports
                            </Button>
                            <Button
                                color="danger"
                                startContent={<FaTrash />}
                                onPress={() => {
                                    setSelectedLesson(null);
                                    confirmDelete(selectedLesson);
                                }}
                            >
                                Delete Lesson
                            </Button>
                        </div>

                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION POPUP */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-default-100 rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold text-danger mb-2">🗑️ Delete Lesson</h2>
                        <p className="text-default-700">
                            Are you sure you want to permanently delete{" "}
                            <span className="font-semibold">"{deleteTarget?.title}"</span>?
                        </p>
                        <p className="text-default-500 text-sm mt-1">
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="flat" onPress={() => setShowDeleteConfirm(false)}>
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