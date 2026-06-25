"use client";

import { useEffect, useState } from "react";
import { Card, Avatar } from "@heroui/react";

export default function TopContributors() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/top-contributors`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-10">
          Top Contributors of the Week
        </h2>

        <div className="grid gap-4">
          {users.map((user, index) => (
            <Card
              key={index}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <Avatar name={user.authorName} size="md" />

                <div>
                  <h3 className="font-semibold">
                    {user.authorName}
                  </h3>
                  <p className="text-sm text-default-500">
                    {user.totalLessons} lessons this week
                  </p>
                </div>
              </div>

              <span className="text-xl font-bold text-primary">
                #{index + 1}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}