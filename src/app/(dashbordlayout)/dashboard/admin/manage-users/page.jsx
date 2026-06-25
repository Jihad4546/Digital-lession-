"use client";

import { Card, Input, Avatar, Button, Chip } from "@heroui/react";
import { FaSearch, FaUserShield, FaTrash } from "react-icons/fa";

const users = [
  {
    _id: 1,
    name: "Jahid Hosen",
    email: "jahid@gmail.com",
    role: "user",
    lessons: 12,
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    _id: 2,
    name: "Siam Ahmed",
    email: "siam@gmail.com",
    role: "admin",
    lessons: 32,
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    _id: 3,
    name: "Rahat Islam",
    email: "rahat@gmail.com",
    role: "user",
    lessons: 7,
    image: "https://i.pravatar.cc/150?img=3",
  },
];

export default function ManageUsersPage() {
  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <Card className="p-6">
        <h1 className="text-3xl font-bold">👥 Manage Users</h1>
        <p className="text-default-500 mt-2">Manage user roles and accounts</p>
      </Card>

      {/* STATS */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-default-500">Total Users</p>
          <h2 className="text-3xl font-bold">245</h2>
        </Card>
        <Card className="p-5">
          <p className="text-default-500">Total Admins</p>
          <h2 className="text-3xl font-bold">4</h2>
        </Card>
        <Card className="p-5">
          <p className="text-default-500">Total Creators</p>
          <h2 className="text-3xl font-bold">173</h2>
        </Card>
      </div>

      {/* FILTER */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <Input placeholder="Search users..." startContent={<FaSearch />} />
          <select className="border rounded-xl px-4 py-2 md:w-60">
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </Card>

      {/* TABLE — plain HTML, no HeroUI Table */}
      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-default-200 text-default-500 text-left">
                <th className="pb-3 pr-4 font-medium">USER</th>
                <th className="pb-3 pr-4 font-medium">EMAIL</th>
                <th className="pb-3 pr-4 font-medium">ROLE</th>
                <th className="pb-3 pr-4 font-medium">LESSONS</th>
                <th className="pb-3 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-default-100 hover:bg-default-50 transition-colors"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.image} size="sm" />
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">{user.email}</td>
                  <td className="py-3 pr-4">
                    <Chip
                      color={user.role === "admin" ? "success" : "default"}
                      variant="flat"
                      size="sm"
                    >
                      {user.role}
                    </Chip>
                  </td>
                  <td className="py-3 pr-4">{user.lessons}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {user.role !== "admin" && (
                        <Button
                          size="sm"
                          color="primary"
                          startContent={<FaUserShield />}
                        >
                          Make Admin
                        </Button>
                      )}
                      <Button size="sm" color="danger" isIconOnly>
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}