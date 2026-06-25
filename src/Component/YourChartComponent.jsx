"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", lessons: 2 },
  { day: "Tue", lessons: 4 },
  { day: "Wed", lessons: 3 },
  { day: "Thu", lessons: 6 },
  { day: "Fri", lessons: 5 },
  { day: "Sat", lessons: 7 },
  { day: "Sun", lessons: 4 },
];

export default function ActivityChart() {
  const [mounted, setMounted] = useState(false);

  // FIXED: SSR/Hydration Error হ্যান্ডেল করার জন্য মাউন্ট চেক
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-white/5">
        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-72 w-full p-4 bg-white dark:bg-slate-900/40 backdrop-blur border border-slate-200/60 dark:border-white/10 rounded-2xl shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Weekly Activity
        </h3>
        <p className="text-xs text-slate-400">Lessons shared over the last 7 days</p>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            {/* ডার্ক মোড ফ্রেন্ডলি হালকা ব্যাকগ্রাউন্ড গ্রিড লাইন */}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            
            {/* X Axis - রেসপন্সিভ ফন্ট সাইজ এবং কালার */}
            <XAxis 
              dataKey="day" 
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            
            {/* Y Axis - রেসপন্সিভ ফন্ট সাইজ */}
            <YAxis 
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            
            {/* প্রিমিয়াম কাস্টমাইজড টুলটিপ */}
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
              }}
              itemStyle={{ color: "#c084fc" }}
              labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
            />
            
            {/* গ্রেডিয়েন্ট বা প্রিমিয়াম ভাইব দেওয়ার জন্য ভাইওলেট লাইন */}
            <Line
              type="monotone"
              dataKey="lessons"
              stroke="url(#colorLessons)"
              strokeWidth={3.5}
              dot={{ stroke: "#a855f7", strokeWidth: 2, r: 4, fill: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#ec4899" }}
            />

            {/* লাইনের নিচে হালকা গ্রেডিয়েন্ট গ্লো ইফেক্ট দেওয়ার জন্য ডেফিনিশন */}
            <defs>
              <linearGradient id="colorLessons" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}