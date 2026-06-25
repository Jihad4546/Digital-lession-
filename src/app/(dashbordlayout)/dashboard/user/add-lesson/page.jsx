"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddLessonPage() {
  const { data: session } = authClient.useSession();
  const isPremium = session?.user?.isPremium ?? false;

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

    const finalData = {
      ...form,
      accessLevel: isPremium ? form.access : "Free",
      creatorEmail: session?.user?.email,
      creatorName: session?.user?.name,
      creatorPhoto: session?.user?.image,
    };

    try {
      const res = await fetch("http://localhost:8000/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const data = await res.json();

      if (data.insertedId) {
        toast.success("Lesson created successfully!");
        setForm({
          title: "",
          description: "",
          category: "Personal Growth",
          tone: "Motivational",
          image: "",
          access: "Free",
        });
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      toast.error("Server error!");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto text-white">

      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold">
        Add New Lesson
      </h1>
      <p className="text-slate-400 mt-1">
        Share your life experience, insight or lesson
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 bg-slate-900 border border-white/5 p-6 rounded-2xl"
      >

        {/* Title */}
        <div>
          <label className="text-sm text-slate-300">Lesson Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-xl bg-slate-800 outline-none border border-white/5"
            placeholder="Enter lesson title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-slate-300">
            Full Description / Story
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full mt-2 p-3 rounded-xl bg-slate-800 outline-none border border-white/5"
            placeholder="Write your life lesson..."
            required
          />
        </div>

        {/* Dropdown Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Category */}
          <div>
            <label className="text-sm text-slate-300">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-white/5"
            >
              <option>Personal Growth</option>
              <option>Career</option>
              <option>Relationships</option>
              <option>Mindset</option>
              <option>Mistakes Learned</option>
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="text-sm text-slate-300">Emotional Tone</label>
            <select
              name="tone"
              value={form.tone}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-white/5"
            >
              <option>Motivational</option>
              <option>Sad</option>
              <option>Realization</option>
              <option>Gratitude</option>
            </select>
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="text-sm text-slate-300">
            Image (Optional URL)
          </label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-white/5"
            placeholder="https://..."
          />
        </div>

        {/* Access Level */}
        <div className="relative">
          <label className="text-sm text-slate-300">Access Level</label>

          <select
            name="access"
            value={form.access}
            onChange={handleChange}
            disabled={!isPremium}
            className={`w-full mt-2 p-3 rounded-xl border border-white/5 bg-slate-800 ${!isPremium ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </select>

          {!isPremium && (
            <p className="text-xs text-amber-400 mt-2">
              Upgrade to Premium to create paid lessons.
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-2 p-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 font-semibold hover:opacity-90"
        >
          Create Lesson
        </button>
      </form>
    </div>
  );
}