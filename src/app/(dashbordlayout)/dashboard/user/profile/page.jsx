"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FaCrown, FaCamera } from "react-icons/fa";
import { Button, Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

// ⚠️ আপনার IMGBB API KEY টি এখানে দিন অথবা .env.local ফাইলে রাখুন
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "YOUR_IMGBB_API_KEY_HERE";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  
  const [editName, setEditName] = useState("");
  const [editPhoto, setEditPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    if (session?.user) {
      setEditName(session.user.name || "");
      setEditPhoto(session.user.image || "");
    }
  }, [session]);

  // ─── ১. IMGBB ফাইল আপলোড হ্যান্ডলার ──────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ফাইল সাইজ চেক (ঐচ্ছিক - 2MB এর বেশি হলে রিজেক্ট করতে পারেন)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File size must be less than 2MB");
    }

    setUploading(true);
    const toastId = toast.loading("Uploading image to imgbb...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      // imgbb API তে ডিরেক্ট হিট
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        const uploadedUrl = data.data.display_url;
        setEditPhoto(uploadedUrl); // আপলোড হওয়া লিংক স্টেটে সেট হলো
        toast.success("Image uploaded successfully! 📸", { id: toastId });
      } else {
        throw new Error("ImgBB upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image. Try again!", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  // ─── ২. প্রোফাইল আপডেট (সার্ভার সিঙ্ক) ───────────────────────────
  const handleUpdate = async () => {
    if (!session?.user?.email) return;
    if (!editName.trim()) return toast.error("Name cannot be empty!");

    setUpdateLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/users/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email.toLowerCase().trim(),
          name: editName,
          image: editPhoto, // imgbb থেকে পাওয়া ডাইনামিক লিংক সার্ভারে যাচ্ছে
        }),
      });

      const data = await res.json();

      if (res.ok || data.success) {
        toast.success("Profile updated successfully! 🎉");
        await authClient.updateUser({
          name: editName,
          image: editPhoto,
        });
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while updating profile!");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" color="secondary" label="Loading profile..." />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-8 text-center bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl max-w-xl mx-auto mt-10">
        ⚠️ Please log in to view your profile dashboard.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto text-white">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account settings and profile picture.</p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-slate-900/60 backdrop-blur border border-white/5 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-center md:items-start shadow-xl">
        
        {/* PHOTO SECTION WITH LIVE UPLOAD BUTTON */}
        <div className="relative w-24 h-24 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden flex-shrink-0 group shadow-md">
          {uploading ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 gap-1">
              <Spinner size="sm" color="secondary" />
              <span className="text-[9px] text-purple-400 font-medium">Uploading...</span>
            </div>
          ) : editPhoto ? (
            <img
              src={editPhoto}
              alt="profile"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.src = "https://api.dicebear.com/7.x/bottts/svg?seed=fallback";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs text-center p-2 font-medium">
              No Avatar
            </div>
          )}

          {/* Camera Overlay Icon */}
          {!uploading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer text-slate-200 gap-1"
            >
              <FaCamera size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
            </button>
          )}

          {/* Hidden HTML File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* INFO FORM */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-100">{session.user.name}</h2>
            {session.user.isPremium && (
              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                <FaCrown size={12} /> Premium Member
              </span>
            )}
          </div>

          <p className="text-slate-400 text-sm text-center md:text-left">{session.user.email}</p>

          {/* EDIT FORM */}
          <div className="pt-2">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Update Details</label>
            <div className="mt-2 grid grid-cols-1 gap-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="p-3 rounded-xl bg-slate-800/80 outline-none border border-white/5 text-sm focus:border-purple-500/50 transition-all text-slate-200 placeholder-slate-500 w-full"
                placeholder="Display Name"
              />
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                color="secondary"
                size="sm"
                className="font-bold px-6 shadow-lg shadow-purple-500/10 w-full sm:w-auto"
                isLoading={updateLoading}
                disabled={uploading}
                onPress={handleUpdate}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* USER LESSONS */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-200 tracking-tight">My Public Lessons</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {myLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 hover:bg-white/[0.02] border-l-2 hover:border-l-purple-500 transition-all duration-300 shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-200 text-sm sm:text-base">{lesson.title}</h3>
                <span className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/10 font-medium mt-2">
                  {lesson.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-4 font-medium">Published: {lesson.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}