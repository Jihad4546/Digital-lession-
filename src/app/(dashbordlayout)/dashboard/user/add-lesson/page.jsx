"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddLessonPage() {
  const { data: session } = authClient.useSession();
  const isPremium = session?.user?.isPremium ?? false;

  const [loading, setLoading] = useState(false); // বাটন স্প্যামিং প্রতিরোধের জন্য স্টেট
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Personal Growth",
    tone: "Motivational",
    image: "",
    access: "Free",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // রিকোয়েস্ট শুরু হলে বাটন লক হবে

    // ক্রিয়েটর ইনফো সেফটি চেক
    const finalData = {
      ...form,
      accessLevel: isPremium ? form.access : "Free",
      creatorEmail: session?.user?.email || "anonymous@test.com",
      creatorName: session?.user?.name || "Anonymous",
      creatorPhoto: session?.user?.image || "",
    };

    try {
      // FIXED: লোকালহোস্ট পরিবর্তন করে ডাইনামিক এনভায়রনমেন্ট ভেরিয়েবল ব্যবহার করা হয়েছে
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${apiUrl}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const data = await res.json();

      // মঙ্গোডিবি অনেক সময় insertedId দেয়, আবার অনেক সময় success: true দেয়। ২টাই হ্যান্ডেল করা হলো:
      if (data.insertedId || data.success) {
        toast.success("Lesson created successfully 🎉");
        setForm({
          title: "",
          description: "",
          category: "Personal Growth",
          tone: "Motivational",
          image: "",
          access: "Free",
        });
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error("Failed to connect to server!");
    } finally {
      setLoading(false); // কাজ শেষ হলে বাটন আবার আনলক হবে
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Add New Lesson
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Share your life experience, insight or wisdom with the community.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-slate-900/60 backdrop-blur border border-white/5 p-5 sm:p-8 rounded-2xl shadow-xl"
      >
        {/* Title */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lesson Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-xl bg-slate-800/80 outline-none border border-white/5 text-sm focus:border-pink-500/50 transition-all text-slate-100 placeholder-slate-500"
            placeholder="e.g., Embracing Failure in Early 20s"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Full Description / Story
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full mt-2 p-3 rounded-xl bg-slate-800/80 outline-none border border-white/5 text-sm focus:border-pink-500/50 transition-all text-slate-100 placeholder-slate-500 resize-none"
            placeholder="Deeply explain the context, what happened, and what you learned..."
            required
          />
        </div>

        {/* Dropdown Row - Fully Mobile Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-white/5 text-sm text-slate-200 outline-none focus:border-pink-500/50 transition-all"
            >
              <option className="bg-slate-900">Personal Growth</option>
              <option className="bg-slate-900">Career</option>
              <option className="bg-slate-900">Relationships</option>
              <option className="bg-slate-900">Mindset</option>
              <option className="bg-slate-900">Mistakes Learned</option>
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Emotional Tone</label>
            <select
              name="tone"
              value={form.tone}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-white/5 text-sm text-slate-200 outline-none focus:border-pink-500/50 transition-all"
            >
              <option className="bg-slate-900">Motivational</option>
              <option className="bg-slate-900">Sad</option>
              <option className="bg-slate-900">Realization</option>
              <option className="bg-slate-900">Gratitude</option>
            </select>
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Cover Image URL (Optional)
          </label>
          <input
            type="url" // URL ভ্যালিডেশন অন করা হয়েছে
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-xl bg-slate-800/80 border border-white/5 text-sm focus:border-pink-500/50 transition-all text-slate-100 placeholder-slate-500"
            placeholder="https://images.unsplash.com/... (or leave blank)"
          />
        </div>

        {/* Access Level */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Access Level</label>
          <select
            name="access"
            value={form.access}
            onChange={handleChange}
            disabled={!isPremium}
            className={`w-full mt-2 p-3 rounded-xl border border-white/5 bg-slate-800 text-sm text-slate-200 outline-none transition-all ${
              !isPremium ? "opacity-40 cursor-not-allowed bg-slate-900" : "focus:border-pink-500/50"
            }`}
          >
            <option value="Free" className="bg-slate-900">Free (Open to everyone)</option>
            <option value="Premium" className="bg-slate-900">Premium (Members only)</option>
          </select>

          {!isPremium && (
            <p className="text-xs text-amber-400/80 mt-2 flex items-center gap-1.5 font-medium">
              ✦ Upgrade to Premium to unlock monetization and paid lessons.
            </p>
          )}
        </div>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 p-3 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 font-bold text-sm shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all duration-300 flex items-center justify-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.01]"
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating Lesson...</span>
            </>
          ) : (
            <span>Publish Lesson</span>
          )}
        </button>
      </form>
    </div>
  );
}