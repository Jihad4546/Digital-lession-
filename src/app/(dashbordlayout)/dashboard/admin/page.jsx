"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, Avatar, Divider } from "@heroui/react";
import { FaUsers, FaBook, FaFlag, FaCalendarDay } from "react-icons/fa";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid,
  XAxis, YAxis, Tooltip, BarChart, Bar,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_APP_URL?.replace('3000', '8000')}/api/admin/stats`)
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data);
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!stats) return <p className="p-6">No data found</p>;

  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-default-500">Welcome back! Here's your platform overview.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card shadow="sm">
          <div className="flex items-center gap-4 p-4">
            <FaUsers size={35} />
            <div>
              <p className="text-default-500">Total Users</p>
              <h2 className="text-3xl font-bold">{stats.totalUsers}</h2>
            </div>
          </div>
        </Card>

        <Card shadow="sm">
          <div className="flex items-center gap-4 p-4">
            <FaBook size={35} />
            <div>
              <p className="text-default-500">Public Lessons</p>
              <h2 className="text-3xl font-bold">{stats.totalLessons}</h2>
            </div>
          </div>
        </Card>

        <Card shadow="sm">
          <div className="flex items-center gap-4 p-4">
            <FaFlag size={35} />
            <div>
              <p className="text-default-500">Reported Lessons</p>
              <h2 className="text-3xl font-bold">{stats.reportedLessons}</h2>
            </div>
          </div>
        </Card>

        <Card shadow="sm">
          <div className="flex items-center gap-4 p-4">
            <FaCalendarDay size={35} />
            <div>
              <p className="text-default-500">Today's Lessons</p>
              <h2 className="text-3xl font-bold">{stats.todayLessonsCount}</h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><h3 className="font-semibold">Lesson Growth</h3></CardHeader>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <LineChart data={stats.lessonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="lessons" stroke="#006FEE" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader><h3 className="font-semibold">User Growth</h3></CardHeader>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={stats.userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#17C964" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Contributors */}
        <Card>
          <CardHeader><h3 className="font-semibold">Most Active Contributors</h3></CardHeader>
          <div className="p-4">
            {stats.contributors.map((user) => (
              <div key={user._id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Avatar src={user.image} />
                  <div>
                    <h4>{user.name || user._id}</h4>
                    <p className="text-sm text-default-500">{user.lessons} Lessons</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Lessons */}
        <Card>
          <CardHeader><h3 className="font-semibold">Today's New Lessons</h3></CardHeader>
          <div className="p-4">
            {stats.todayLessonsList.length === 0 ? (
              <p className="text-default-500">No lessons today yet.</p>
            ) : (
              stats.todayLessonsList.map((lesson, i) => (
                <div key={i}>
                  <p className="py-3">📚 {lesson}</p>
                  {i !== stats.todayLessonsList.length - 1 && <hr />}
                </div>
              ))
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}