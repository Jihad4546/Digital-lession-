"use client";

import { useEffect, useState } from "react";
import { Card, Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

// ডামি ডেটা: এপিআই থেকে ডেটা না আসলে এই ডেটাগুলো স্ক্রিনে দেখাবে
const dummyLessons = [
  {
    _id: "dummy-1",
    title: "Mastering Consistency in Tech Career",
    lesson: "In my 5 years of web development journey, I learned that consistency beats raw talent. Spending 2 hours every day writing code is far better than coding for 15 hours straight once a week.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    authorName: "Jihad Hosen"
  },
  {
    _id: "dummy-2",
    title: "The Art of Clean Code & Refactoring",
    lesson: "Writing code that works is easy, but writing code that other developers can understand is hard. Always break down big functions into smaller, reusable hooks and utilities.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    authorName: "Programming Hero Mentor"
  },
  {
    _id: "dummy-3",
    title: "Overcoming Tutorial Hell as a Beginner",
    lesson: "Stop watching endless courses without building anything. The true learning starts when you close YouTube, open VS Code, and try to build a full-stack Next.js project by yourself from scratch.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop",
    authorName: "Ananda Mohan Devs"
  }
];

export default function FeaturedLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/featured`)
      .then((res) => res.json())
      .then((data) => {
        let fetchedData = [];
        if (Array.isArray(data)) {
          fetchedData = data;
        } else if (data && Array.isArray(data.lessons)) {
          fetchedData = data.lessons;
        }

        // এপিআই ডেটা ফাঁকা হলে ডামি ডেটা সেট করবে, নয়তো এপিআই ডেটা দেখাবে
        if (fetchedData.length > 0) {
          setLessons(fetchedData);
        } else {
          setLessons(dummyLessons);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching lessons, using dummy data instead:", err);
        // এপিআই ক্র্যাশ করলেও ডামি ডেটা ব্যাকআপ হিসেবে দেখাবে
        setLessons(dummyLessons);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 md:px-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Featured Life Lessons
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Hand-picked meaningful experiences selected by our community admins.
          </p>
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl" />
            ))}
          </div>
        )}

        {/* Responsive Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Card
                key={lesson._id}
                className="overflow-hidden border border-slate-200/60 dark:border-white/10 hover:-translate-y-1.5 transition-all duration-300 bg-white/80 dark:bg-slate-900/40 backdrop-blur rounded-3xl shadow-sm hover:shadow-md"
              >
                {/* Image */}
                <div className="h-48 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={lesson.image}
                    alt={lesson.title || "Lesson image"}
                    fill
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    unoptimized={lesson._id.includes("dummy")} // ডামি Unsplash ইমেজের জন্য নেক্সট জেএস ডোমেন ইরর এড়াতে এটি দেওয়া
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-500 dark:text-pink-400">
                      {lesson._id.includes("dummy") ? "Sample" : "Featured"}
                    </span>

                    <h3 className="text-lg font-bold mt-3 text-slate-800 dark:text-slate-100 line-clamp-1">
                      {lesson.title}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {lesson.lesson}
                    </p>
                  </div>

                  {/* Responsive Footer Info */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 truncate max-w-[120px]">
                      by {lesson.authorName || "Anonymous"}
                    </span>

                    <Link href={`/public-lessons/${lesson._id}`} className="shrink-0">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold rounded-xl px-4 hover:scale-105 transition"
                      >
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}