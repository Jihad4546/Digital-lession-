"use client";

import { Card } from "@heroui/react";
import { FiBookOpen, FiUsers, FiTrendingUp, FiHeart } from "react-icons/fi";

const benefits = [
  {
    title: "Preserve Personal Wisdom",
    desc: "Capture real-life experiences so valuable lessons are never lost over time.",
    icon: FiBookOpen,
  },
  {
    title: "Learn From Real Stories",
    desc: "Understand life better through authentic experiences shared by others.",
    icon: FiUsers,
  },
  {
    title: "Grow Through Reflection",
    desc: "Turn past challenges into growth opportunities and better decisions.",
    icon: FiTrendingUp,
  },
  {
    title: "Build Emotional Awareness",
    desc: "Strengthen empathy and emotional intelligence through shared journeys.",
    icon: FiHeart,
  },
];

export default function LifeLessonsSection() {
  return (
    <section className="w-full py-16 px-4 md:px-10 bg-white dark:bg-black">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          Why Learning From Life Matters
        </h2>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Life experiences are the most powerful teachers. Preserving them helps
          individuals and communities grow together.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((item, index) => {
          const Icon = item.icon;

          return (
            <Card
              key={index}
              className="
                p-6
                border border-gray-200 dark:border-white/10
                bg-white/80 dark:bg-white/5
                backdrop-blur
                hover:shadow-xl
                transition-all duration-300
              "
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-white/10 text-blue-600 dark:text-white mb-4">
                <Icon size={22} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.desc}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}