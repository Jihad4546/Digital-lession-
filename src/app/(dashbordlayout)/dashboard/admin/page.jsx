"use client";

import {
  Card,
 
  CardHeader,
  Avatar,
  Divider,
} from "@heroui/react";

import {
  FaUsers,
  FaBook,
  FaFlag,
  FaCalendarDay,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const lessonData = [
  { month: "Jan", lessons: 30 },
  { month: "Feb", lessons: 50 },
  { month: "Mar", lessons: 80 },
  { month: "Apr", lessons: 120 },
  { month: "May", lessons: 160 },
  { month: "Jun", lessons: 220 },
];

const userData = [
  { month: "Jan", users: 20 },
  { month: "Feb", users: 40 },
  { month: "Mar", users: 70 },
  { month: "Apr", users: 110 },
  { month: "May", users: 150 },
  { month: "Jun", users: 200 },
];

const contributors = [
  {
    name: "Jahid Hosen",
    lessons: 42,
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Siam",
    lessons: 31,
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Rahat",
    lessons: 26,
    image: "https://i.pravatar.cc/150?img=3",
  },
];

const todayLessons = [
  "How Failure Changed My Life",
  "Importance of Self Discipline",
  "My First Business Mistake",
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-default-500">
          Welcome back! Here's your platform overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <Card shadow="sm">
          <div className="flex-row items-center gap-4">
            <FaUsers size={35} />
            <div>
              <p className="text-default-500">
                Total Users
              </p>
              <h2 className="text-3xl font-bold">
                1,245
              </h2>
            </div>
          </div>
        </Card>

        <Card shadow="sm">
          <div className="flex-row items-center gap-4">
            <FaBook size={35} />
            <div>
              <p className="text-default-500">
                Public Lessons
              </p>
              <h2 className="text-3xl font-bold">
                542
              </h2>
            </div>
          </div>
        </Card>

        <Card shadow="sm">
          <div className="flex-row items-center gap-4">
            <FaFlag size={35} />
            <div>
              <p className="text-default-500">
                Reported Lessons
              </p>
              <h2 className="text-3xl font-bold">
                12
              </h2>
            </div>
          </div>
        </Card>

        <Card shadow="sm">
          <div className="flex-row items-center gap-4">
            <FaCalendarDay size={35} />
            <div>
              <p className="text-default-500">
                Today's Lessons
              </p>
              <h2 className="text-3xl font-bold">
                8
              </h2>
            </div>
          </div>
        </Card>

      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">

        <Card>
          <CardHeader>
            <h3 className="font-semibold">
              Lesson Growth
            </h3>
          </CardHeader>

          <div className="h-[300px]">
            <ResponsiveContainer>
              <LineChart data={lessonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  dataKey="lessons"
                  stroke="#006FEE"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">
              User Growth
            </h3>
          </CardHeader>

          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="users"
                  fill="#17C964"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Contributors */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">
              Most Active Contributors
            </h3>
          </CardHeader>

          <div>
            {contributors.map((user) => (
              <div
                key={user.name}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={user.image} />

                  <div>
                    <h4>{user.name}</h4>
                    <p className="text-sm text-default-500">
                      {user.lessons} Lessons
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Lessons */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">
              Today's New Lessons
            </h3>
          </CardHeader>

          <div>
            {todayLessons.map((lesson, i) => (
              <div key={i}>
                <p className="py-3">
                  📚 {lesson}
                </p>

                {i !== todayLessons.length - 1 && (
                    <hr />
                )}
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}