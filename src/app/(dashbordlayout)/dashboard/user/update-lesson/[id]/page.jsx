"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Input, Spinner } from "@heroui/react"; // শুধুমাত্র স্টেবল কম্পোনেন্টগুলো রাখা হয়েছে
import toast from "react-hot-toast";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

const categories = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function UpdateLessonPage() {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const params = useParams();
    const lessonId = params.id;

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        emotionalTone: "",
        accessLevel: "Free",
    });

    // ─── 1. Fetch Data ──────────────────────────────────────────
    useEffect(() => {
        if (!lessonId) return;

        const fetchLessonDetails = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/api/lessons/${lessonId}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();

                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    category: data.category || "",
                    emotionalTone: data.emotionalTone || "",
                    accessLevel: data.accessLevel || "Free",
                });
            } catch (error) {
                console.error(error);
                toast.error("Failed to load lesson data!");
            } finally {
                setLoading(false);
            }
        };

        fetchLessonDetails();
    }, [lessonId]);

    // ─── 2. Handle Submit ────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.user?.email) return toast.error("Please log in first");

        setUpdating(true);
        try {
            const updatedData = {
                ...formData,
                creatorEmail: session.user.email.toLowerCase().trim(),
            };

            const res = await fetch(`${SERVER_URL}/api/lessons/${lessonId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            const data = await res.json();

            if (data.modifiedCount > 0 || data.matchedCount > 0) {
                toast.success("Lesson updated successfully! 🎉");
                router.push("/dashboard/user/my-lessons");
                router.refresh();
            } else {
                toast.error("No changes were made.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong during update.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner size="lg" color="secondary" label="Loading lesson data..." />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-6 text-white bg-[#0f172a] border border-white/5 rounded-2xl my-10 shadow-xl">
            <h1 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-2">
                ✏️ Edit/Update Lesson
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input (HeroUI Input works fine, but standard fallback just in case) */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs text-slate-400 pl-1 font-medium">Lesson Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="Enter lesson title..."
                        className="w-full bg-transparent border-2 border-white/10 hover:border-white/20 focus:border-purple-500 rounded-xl px-3 py-3 text-sm outline-none transition-all text-slate-200"
                    />
                </div>

                {/* Custom Textarea with Tailwind - 100% Bug Free */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs text-slate-400 pl-1 font-medium">
                        Full Description / Story / Insight
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={6}
                        placeholder="Write your story here..."
                        className="w-full bg-transparent border-2 border-white/10 hover:border-white/20 focus:border-purple-500 rounded-xl px-3 py-3 text-sm outline-none transition-all text-slate-200 resize-y"
                    />
                </div>

                {/* Custom Dropdown: Category */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs text-slate-400 pl-1 font-medium">Select Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        className="w-full bg-[#1e293b] border border-white/10 focus:border-purple-500 text-white rounded-xl px-3 py-3 text-sm outline-none transition-colors cursor-pointer appearance-none"
                    >
                        <option value="" disabled>Choose a Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat} className="bg-[#1e293b] text-white">
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Custom Dropdown: Emotional Tone */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs text-slate-400 pl-1 font-medium">Emotional Tone</label>
                    <select
                        value={formData.emotionalTone}
                        onChange={(e) => setFormData({ ...formData, emotionalTone: e.target.value })}
                        required
                        className="w-full bg-[#1e293b] border border-white/10 focus:border-purple-500 text-white rounded-xl px-3 py-3 text-sm outline-none transition-colors cursor-pointer appearance-none"
                    >
                        <option value="" disabled>Choose a Tone</option>
                        {tones.map((tone) => (
                            <option key={tone} value={tone} className="bg-[#1e293b] text-white">
                                {tone}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Custom Dropdown: Access Level */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs text-slate-400 pl-1 font-medium">Access Level</label>
                    <select
                        value={formData.accessLevel}
                        onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                        required
                        className="w-full bg-[#1e293b] border border-white/10 focus:border-purple-500 text-white rounded-xl px-3 py-3 text-sm outline-none transition-colors cursor-pointer appearance-none"
                    >
                        {/* Free অপশনটি সবার জন্য খোলা থাকবে */}
                        <option value="Free" className="bg-[#1e293b] text-white">
                            Free
                        </option>

                        {/* ইউজার যদি প্রিমিয়াম বা এডমিন না হয়, তবে এই অপশনটি disabled থাকবে */}
                        <option
                            value="Premium"
                            className="bg-[#1e293b] text-white disabled:text-slate-500 disabled:cursor-not-allowed"
                            disabled={session?.user?.role !== "premium" && session?.user?.role !== "admin"} // <── আপনার প্রজেক্টের রোল অনুযায়ী 'premium' বা 'admin' নাম মিলিয়ে নিন
                        >
                            ⭐ Premium {session?.user?.role !== "premium" && session?.user?.role !== "admin" ? "(Pro Only)" : ""}
                        </option>
                    </select>

                    {/* ফ্রি ইউজারদের জন্য ছোট একটা নোটিশ (ঐচ্ছিক, দেখতে সুন্দর লাগবে) */}
                    {session?.user?.role !== "premium" && session?.user?.role !== "admin" && (
                        <p className="text-[11px] text-amber-400/80 pl-1">
                            ⚠️ Upgrade your account to post Premium lessons.
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <Button
                        variant="flat"
                        className="bg-slate-800 text-white hover:bg-slate-700"
                        onPress={() => router.push("/dashboard/user/my-lessons")}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="secondary"
                        type="submit"
                        isLoading={updating}
                        className="shadow-lg shadow-purple-500/20 px-6 font-semibold"
                    >
                        Update Lesson
                    </Button>
                </div>
            </form>
        </div>
    );
}