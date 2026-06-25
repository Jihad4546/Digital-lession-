"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Spinner } from "@heroui/react";
import toast from "react-hot-toast";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

const categories = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function UpdateLessonPage() {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const router = useRouter();
    const params = useParams();
    
    // SAFE ID FETCHING (Next.js App Router dynamic match)
    const lessonId = params?.id;

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        emotionalTone: "",
        accessLevel: "Free",
    });

    const userEmail = session?.user?.email;
    const userRole = session?.user?.role; // Better Auth-এর প্রিমিয়াম রোল ফিল্ড

    // ─── 1. Fetch Data & Security Ownership Check ──────────────────────────────────────────
    useEffect(() => {
        if (!lessonId) return;
        // সেশন লোড হওয়া পর্যন্ত ওয়েট করা
        if (sessionLoading) return; 
        if (!userEmail) {
            toast.error("Please log in to edit lessons");
            router.push("/login");
            return;
        }

        const fetchLessonDetails = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/api/lessons/${lessonId}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();

                // 🔒 SECURITY CHECK: লেসনের ওনার আর কারেন্ট ইউজার এক কি না?
                // আপনার ডাটাবেজের ফিল্ডের নাম creatorEmail বা email যেটিই হোক, নিচের লাইনে মিলিয়ে নিবেন
                const dbCreatorEmail = data?.creatorEmail || data?.email || "";
                
                if (dbCreatorEmail.toLowerCase().trim() !== userEmail.toLowerCase().trim() && userRole !== "admin") {
                    toast.error("Unauthorized! You do not own this lesson.");
                    router.push("/dashboard/user/my-lessons");
                    return;
                }

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
    }, [lessonId, userEmail, sessionLoading, userRole, router]);

    // ─── 2. Handle Submit ────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userEmail) return toast.error("Please log in first");

        setUpdating(true);
        try {
            const updatedData = {
                ...formData,
                // ওনারশিপ সুরক্ষার জন্য ব্যাকএন্ডের verifyOwner মিডলওয়্যারকে পাস করানোর ইমেইল চেক
                email: userEmail.toLowerCase().trim(),
            };

            const res = await fetch(`${SERVER_URL}/api/lessons/${lessonId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            const data = await res.json();

            // মঙ্গোডিবি অনেক সময় modifiedCount ০ দেয় যদি ইউজার কিছুই চেঞ্জ না করে ডিরেক্ট সেভ দেয়
            if (data.modifiedCount > 0 || data.matchedCount > 0 || data.success) {
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

    if (sessionLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner size="lg" color="secondary" label="Verifying ownership & data..." />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-5 md:p-8 text-white bg-slate-900/60 backdrop-blur border border-white/5 rounded-2xl my-10 shadow-2xl">
            <h1 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
                ✏️ Edit & Update Lesson
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title Input */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs text-slate-400 pl-1 font-medium">Lesson Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="Enter lesson title..."
                        className="w-full bg-slate-800/50 border border-white/10 hover:border-white/20 focus:border-purple-500 rounded-xl px-3.5 py-3 text-sm outline-none transition-all text-slate-200"
                    />
                </div>

                {/* Description Textarea */}
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
                        className="w-full bg-slate-800/50 border border-white/10 hover:border-white/20 focus:border-purple-500 rounded-xl px-3.5 py-3 text-sm outline-none transition-all text-slate-200 resize-y"
                    />
                </div>

                {/* Grid for Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-xs text-slate-400 pl-1 font-medium">Select Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            className="w-full bg-slate-800 border border-white/10 focus:border-purple-500 text-slate-200 rounded-xl px-3 py-3 text-sm outline-none cursor-pointer"
                        >
                            <option value="" disabled>Choose a Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat} className="bg-slate-900">
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Emotional Tone */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-xs text-slate-400 pl-1 font-medium">Emotional Tone</label>
                        <select
                            value={formData.emotionalTone}
                            onChange={(e) => setFormData({ ...formData, emotionalTone: e.target.value })}
                            required
                            className="w-full bg-slate-800 border border-white/10 focus:border-purple-500 text-slate-200 rounded-xl px-3 py-3 text-sm outline-none cursor-pointer"
                        >
                            <option value="" disabled>Choose a Tone</option>
                            {tones.map((tone) => (
                                <option key={tone} value={tone} className="bg-slate-900">
                                    {tone}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Access Level Dropdown */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs text-slate-400 pl-1 font-medium">Access Level</label>
                    <select
                        value={formData.accessLevel}
                        onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                        required
                        className="w-full bg-slate-800 border border-white/10 focus:border-purple-500 text-slate-200 rounded-xl px-3 py-3 text-sm outline-none cursor-pointer"
                    >
                        <option value="Free" className="bg-slate-900">Free</option>
                        <option
                            value="Premium"
                            className="bg-slate-900 disabled:text-slate-500 disabled:cursor-not-allowed"
                            disabled={userRole !== "premium" && userRole !== "admin"}
                        >
                            ⭐ Premium {userRole !== "premium" && userRole !== "admin" ? "(Pro Only)" : ""}
                        </option>
                    </select>

                    {userRole !== "premium" && userRole !== "admin" && (
                        <p className="text-[11px] text-amber-400/80 pl-1">
                            ⚠️ Upgrade your account to post Premium lessons.
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <Button
                        variant="flat"
                        className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
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