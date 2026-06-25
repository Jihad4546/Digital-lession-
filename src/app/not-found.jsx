"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { FaBrain } from "react-icons/fa";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
      {/* ব্যাকগ্রাউন্ডের জন্য গ্লো বা হালকা ইফেক্ট (আপনার পেজের থিমের সাথে মিল রেখে) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-md mx-auto space-y-6 md:space-y-8 relative z-10">
        
        {/* ক্যাটাগরি ট্যাগের মতো ছোট একটি ব্যাজ */}
        <div className="flex justify-center mb-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm animate-pulse">
            <FaBrain className="text-[10px]" /> 404 Error
          </span>
        </div>

        {/* বড় ৪MD টেক্সট যা অ্যানিমেট হবে */}
        <h1 className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-purple-500 to-indigo-600 drop-shadow-[0_10px_20px_rgba(147,51,234,0.15)] select-none">
          404
        </h1>
        
        {/* আপনার পেজের মেইন হেডিংয়ের মতো গ্রেডিয়েন্ট টেক্সট */}
        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight leading-tight">
          Insight Not Found
        </h2>
        
        {/* আপনার পেজের সাধারণ টেক্সটের মতো ডেসক্রিপশন স্টাইল */}
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed px-4 text-center">
          দুঃখিত, আপনি যে পেজ বা লেসনটি খুঁজছেন তা হয়তো মুছে ফেলা হয়েছে অথবা লিঙ্কটি ভুল। দয়া করে সঠিক লিঙ্কটি পুনরায় ট্রাই করুন।
        </p>

        {/* হোম পেজে ফিরে যাওয়ার বাটন (আপনার কমেন্ট বাটন স্টাইলের সাথে মিল রেখে) */}
        <div className="pt-4 flex justify-center">
          <Button 
            color="secondary" 
            size="md"
            className="bg-purple-600 font-semibold px-6 shadow-lg shadow-purple-600/10 hover:bg-purple-700 transition-all transform hover:scale-[1.01]"
            onPress={() => router.push("/")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}