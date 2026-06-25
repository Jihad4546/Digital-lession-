"use client";

import Link from "next/link";
import { Button, Card } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper CSS ইমপোর্ট
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// আপনার লার্নিং প্ল্যাটফর্ম প্রজেক্টের সাথে মিল রেখে ডাটা আপডেট এবং লিংক যুক্ত করা হয়েছে
const slides = [
  {
    title: "Explore Premium Life Lessons",
    desc: "Create scalable digital skills, access high-quality study content, and grow your career with expert tracks.",
    btn: "Start Learning",
    link: "/public-lessons",
    bg: "from-slate-950 via-indigo-950 to-slate-950",
  },
  {
    title: "Share Your Own Digital Content",
    desc: "Create your own lessons, manage dashboards, and join an active community of global learners today.",
    btn: "Add Your Lesson",
    link: "/dashboard/user/add-lesson",
    bg: "from-slate-950 via-pink-950 to-slate-950",
  },
  {
    title: "Upgrade to Premium Membership",
    desc: "Unlock top 5 daily matches, verified resources, role-based interaction dashboards, and unlimited 1-click applies.",
    btn: "Upgrade Now ✦",
    link: "/pricing",
    bg: "from-slate-950 via-slate-900 to-slate-950",
  },
];

export default function HeroSlider() {
  return (
    <div className="w-full relative group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-[80vh] md:h-[85vh]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className={`h-full w-full flex items-center justify-center bg-gradient-to-r ${slide.bg} px-6 relative overflow-hidden`}
            >
              {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(219,39,119,0.08)_0,transparent_100%)] pointer-events-none" />
              
              <Card className="max-w-3xl w-full p-8 md:p-14 text-center bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-2xl rounded-3xl">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
                  {slide.title}
                </h1>

                <p className="mt-4 text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
                  {slide.desc}
                </p>

                <div className="mt-8 flex justify-center">
                  {/* NEXT.JS LINK দিয়ে বাটন র‍্যাপ করা হয়েছে যাতে রুট কাজ করে */}
                  <Link href={slide.link}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold px-8 rounded-xl shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 hover:scale-105 transition-all duration-300"
                    >
                      {slide.btn}
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper Arrow কাস্টম CSS ওভাররাইড টেইলউইন্ড দিয়ে যাতে আইকন মিসিং না হয় */}
      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: #f472b6 !important;
          transform: scale(0.7);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #f472b6 !important;
          width: 24px !important;
          border-radius: 4px !important;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}