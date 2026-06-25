"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { FaLock, FaCalendarAlt, FaBrain, FaSmile } from "react-icons/fa";

export default function PublicLessonsPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // চেক করুন ইউজার প্রিমিয়াম কি না
  const isUserPremium = session?.user?.plan === "premium" || session?.user?.isPremium === true;

  useEffect(() => {
    // আপনার ব্যাকএন্ড এপিআই থেকে ডেটা আনা
    fetch("http://localhost:8000/api/lessons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLessons(data);
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching lessons:", err);
        setLoading(false);
      });
  }, []);

  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-indigo-400 bg-clip-text text-transparent mb-3">
            Browse Public Life Lessons
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Anyone can browse publicly shared wisdom. Explore perspectives and grow together.
          </p>
        </div>

        {/* Lessons Grid */}
        {lessons.length === 0 ? (
          <div className="text-center text-slate-500 py-12">No public lessons found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => {
              const isPremiumLesson = lesson.accessLevel === "Premium";
              const isOwner = session?.user?.email === lesson.creatorEmail;
              // যদি লেসন প্রিমিয়াম হয় এবং ইউজার প্রিমিয়াম না হয়, আর সে যদি লেসনের মালিকও না হয় -> ব্লার হবে
              const shouldBlur = isPremiumLesson && !isUserPremium && !isOwner;

              return (
                <div
                  key={lesson._id}
                  className="relative flex flex-col justify-between border border-white/5 bg-slate-900/40 rounded-2xl p-6 backdrop-blur-sm overflow-hidden min-h-[320px] transition-all duration-300 hover:border-pink-500/20 hover:shadow-lg hover:shadow-pink-500/5"
                >
                  {/* Premium Lock Overlay / Blur Layer */}
                  {shouldBlur && (
                    <div className="absolute inset-0 z-20 backdrop-blur-md bg-slate-950/75 flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-300">
                      <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-3 border border-pink-500/30">
                        <FaLock className="text-pink-500 text-lg" />
                      </div>
                      <p className="text-sm font-bold text-white mb-1">Premium Lesson</p>
                      <p className="text-xs text-slate-400 mb-4 max-w-[200px]">Upgrade to view this premium content</p>
                      <Link href="/pricing">
                        <button className="text-xs font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-2 px-4 rounded-xl shadow-md hover:shadow-pink-500/20 transition duration-200">
                          Upgrade to View ✦
                        </button>
                      </Link>
                    </div>
                  )}

                  {/* Main Card Content */}
                  <div>
                    {/* Badges row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-slate-300 border border-white/5">
                        <FaBrain className="text-pink-400 text-[10px]" /> {lesson.category}
                      </span>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <FaSmile className="text-[10px]" /> {lesson.emotionalTone}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isPremiumLesson ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {lesson.accessLevel}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white line-clamp-1 mb-2 hover:text-pink-400 transition-colors">
                      {lesson.title}
                    </h3>

                    {/* Short Description Preview */}
                    <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Footer info (Creator & Action) */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    {/* Creator Info */}
                    <div className="flex items-center gap-2.5">
                      <Image
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                        src={lesson.creatorImage || "/default-avatar.png"}
                        alt={lesson.creatorName || "Author"}
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">
                          {lesson.creatorName || "Anonymous"}
                        </p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <FaCalendarAlt className="text-[9px]" /> 
                          {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : "Recent"}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    {!shouldBlur && (
                      <Link href={`/lessons/${lesson._id}`}>
                        <button className="text-xs font-bold text-pink-500 hover:text-pink-400 transition-colors py-1.5 px-3 rounded-lg hover:bg-pink-500/5">
                          See Details →
                        </button>
                      </Link>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}