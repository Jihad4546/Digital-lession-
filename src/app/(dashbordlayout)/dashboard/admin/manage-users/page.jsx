"use client";

import { useState, useEffect } from "react";
import { Card, Input, Avatar, Button, Chip } from "@heroui/react";
import { FaSearch, FaUserShield, FaTrash } from "react-icons/fa";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ManageUsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch users
  useEffect(() => {
    fetch(`${API}/api/admin/users`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter
  const filtered = data.filter(u => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Stats
  const totalUsers = data.length;
  const totalAdmins = data.filter(u => u.role === "admin").length;
  const totalCreators = data.filter(u => u.role === "user").length;

  // Make Admin
  const makeAdmin = async (id) => {
    await fetch(`${API}/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "admin" }),
    });
    setData(prev =>
      prev.map(u => u._id.toString() === id ? { ...u, role: "admin" } : u)
    );
  };

  // Delete
  const confirmDelete = (user) => {
    setDeleteTarget(user);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const idToDelete = deleteTarget._id;
    setShowConfirm(false);
    setDeleteTarget(null);

    await fetch(`${API}/api/admin/users/${idToDelete}`, { method: "DELETE" });
    setData(prev => prev.filter(u => u._id !== idToDelete));
  };

  if (loading) return <p className="p-6">Loading...</p>;

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
          <h2 className="text-3xl font-bold">{totalUsers}</h2>
        </Card>
        <Card className="p-5">
          <p className="text-default-500">Total Admins</p>
          <h2 className="text-3xl font-bold">{totalAdmins}</h2>
        </Card>
        <Card className="p-5">
          <p className="text-default-500">Total Creators</p>
          <h2 className="text-3xl font-bold">{totalCreators}</h2>
        </Card>
      </div>

      {/* FILTER */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search users..."
            startContent={<FaSearch />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1"
          />
          <select
            className="border rounded-xl px-4 py-2 md:w-60"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </Card>

      {/* TABLE */}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-default-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map(user => (
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
                    <td className="py-3 pr-4">
                      {user.lessonsCount ?? "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {user.role !== "admin" && (
                          <Button
                            size="sm"
                            color="primary"
                            startContent={<FaUserShield />}
                            onPress={() => makeAdmin(user._id.toString())}
                          >
                            Make Admin
                          </Button>
                        )}
                        <Button
                          size="sm"
                          color="danger"
                          isIconOnly
                          onPress={() => confirmDelete(user)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DELETE CONFIRMATION */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-default-100 rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-danger mb-2">🗑️ Delete User</h2>
            <p className="text-default-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{deleteTarget?.name}"</span>?
            </p>
            <p className="text-default-500 text-sm mt-1">This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="flat" onPress={() => setShowConfirm(false)}>Cancel</Button>
              <Button color="danger" onPress={handleDelete}>Yes, Delete</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}