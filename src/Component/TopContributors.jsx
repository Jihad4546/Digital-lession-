"use client";

import { useEffect, useState } from "react";
import { Card, Avatar } from "@heroui/react";

// ব্যাকআপ ডামি ডাটা: ডাটাবেজে ডাটা না থাকলে বা সার্ভার অফ থাকলে এটি শো করবে
const dummyContributors = [
  { authorName: "MD Jihad Hosen", totalLessons: 12 },
  { authorName: "Programming Hero Mentor", totalLessons: 9 },
  { authorName: "Ananda Mohan Developer", totalLessons: 5 },
];

export default function TopContributors() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/top-contributors`)
      .then((res) => res.json())
      .then((data) => {
        // সেফটি চেক: ডাটা অ্যারো হলে সেট করবে
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
        } else {
          setUsers(dummyContributors);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching contributors, using dummy:", err);
        setUsers(dummyContributors);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 md:px-8 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-2 text-slate-900 dark:text-white tracking-tight">
          Top Contributors of the Week
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm md:text-base mb-10 max-w-md mx-auto">
          Our amazing community members who shared the most life lessons this week.
        </p>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-2xl" />
            ))}
          </div>
        )}

        {/* Contributors List */}
        {!loading && (
          <div className="grid gap-4">
            {users.map((user, index) => (
              <Card
                key={user._id || user.authorName || index} // সেফ কি হ্যান্ডলিং
                className="flex flex-row items-center justify-between p-4 sm:p-5 border border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-900/40 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Left Side: Avatar & Information */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* র‍্যাঙ্ক অনুযায়ী আভাটারের বর্ডার কালার চেঞ্জ (১ম, ২য়, ৩য় এর জন্য আকর্ষণীয় লুক) */}
                  <Avatar
                    name={user.authorName}
                    size="md"
                    className={`font-bold shrink-0 text-white ${
                      index === 0
                        ? "bg-gradient-to-tr from-yellow-500 to-amber-400 ring-2 ring-amber-400"
                        : index === 1
                        ? "bg-gradient-to-tr from-slate-400 to-slate-300 ring-2 ring-slate-300"
                        : "bg-gradient-to-tr from-pink-500 to-indigo-600"
                    }`}
                  />

                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base truncate">
                      {user.authorName || "Anonymous Learner"}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {user.totalLessons} lessons shared
                    </p>
                  </div>
                </div>

                {/* Right Side: Rank Badge */}
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span
                    className={`text-lg md:text-2xl font-black italic ${
                      index === 0
                        ? "text-amber-500"
                        : index === 1
                        ? "text-slate-400"
                        : index === 2
                        ? "text-amber-700"
                        : "text-pink-500"
                    }`}
                  >
                    #{index + 1}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}