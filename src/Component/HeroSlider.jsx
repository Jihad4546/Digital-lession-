"use client";

import { Button, Card } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    title: "Build Modern Web Apps Faster",
    desc: "Create scalable, high-performance applications using Next.js, React, and modern UI tools.",
    btn: "Get Started",
    bg: "from-blue-600 to-indigo-700",
  },
  {
    title: "Powerful Dashboard System",
    desc: "Manage data, analytics, and workflows with beautiful and intuitive admin dashboards.",
    btn: "Explore Features",
    bg: "from-purple-600 to-pink-600",
  },
  {
    title: "Optimized for Mobile & Speed",
    desc: "Lightning-fast performance with fully responsive design for all devices.",
    btn: "Learn More",
    bg: "from-emerald-600 to-teal-600",
  },
];

export default function HeroSlider() {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-[90vh]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className={`h-[90vh] flex items-center justify-center bg-gradient-to-r ${slide.bg} px-4`}
            >
              <Card className="max-w-2xl w-full p-8 md:p-12 text-center bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  {slide.title}
                </h1>

                <p className="mt-4 text-sm md:text-lg text-white/80">
                  {slide.desc}
                </p>

                <div className="mt-6 flex justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-black font-semibold hover:scale-105 transition"
                  >
                    {slide.btn}
                  </Button>
                </div>
              </Card>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}