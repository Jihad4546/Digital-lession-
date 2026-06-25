"use client";

import { useEffect, useState } from "react";
import { Card, Button } from "@heroui/react";

export default function FeaturedLessons() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/featured`)
      .then((res) => res.json())
      .then(setLessons);
  }, []);

  return (
    <section className="py-16 px-4 md:px-10 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Featured Life Lessons
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Hand-picked meaningful experiences selected by our community admins.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Card
              key={lesson._id}
              className="
                overflow-hidden
                border border-gray-200 dark:border-white/10
                hover:-translate-y-1 transition
                bg-white/80 dark:bg-white/5
                backdrop-blur
              "
            >
              {/* Image */}
              <div className="h-48 w-full">
                <img
                  src={lesson.image}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                  Featured
                </span>

                <h3 className="text-lg font-semibold mt-3">
                  {lesson.title}
                </h3>

                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {lesson.lesson}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-400">
                    {lesson.authorName}
                  </span>

                  <Button size="sm" color="primary" variant="flat">
                    Read More
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}