
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  ShieldBan,
  ShieldCheck,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  GetAllUsers,
  BlockUser,
  UnblockUser,
} from "@/lib/actions/users";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  isBlocked?: boolean;
  businessName?: string;
}

const ManageUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await GetAllUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (user: User) => {
    try {
      setUpdating(user._id);

      if (user.isBlocked) {
        await UnblockUser(user._id);
        toast.success("User unblocked successfully");
      } else {
        await BlockUser(user._id);
        toast.success("User blocked successfully");
      }

      setUsers((prev) =>
        prev.map((item) =>
          item._id === user._id
            ? { ...item, isBlocked: !user.isBlocked }
            : item
        )
      );
    } catch {
      toast.error("Failed to update user status");
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = role === "all" || user.role === role;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-[#94774f]">
          Admin Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#292820]">
          Manage Users
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          View, search and manage all registered users.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#e8e1d7] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Users</p>
            <Users className="text-[#94774f]" size={22} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-[#292820]">
            {users.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#e8e1d7] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Active Users</p>
            <ShieldCheck className="text-green-600" size={22} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-[#292820]">
            {users.filter((user) => !user.isBlocked).length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#e8e1d7] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Blocked Users</p>
            <ShieldBan className="text-red-500" size={22} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-[#292820]">
            {users.filter((user) => user.isBlocked).length}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e8e1d7] bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#94774f]"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#94774f]"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8e1d7] bg-white">
        <div className="border-b border-[#eee8df] px-5 py-4">
          <h2 className="font-semibold text-[#292820]">
            All Registered Users ({filteredUsers.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[#94774f]" size={30} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-[#faf8f5] text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                  <th className="px-5 py-4">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="text-sm">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2eadf] font-semibold text-[#94774f]">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-[#292820]">
                            {user.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#f5efe7] px-3 py-1 text-xs font-medium capitalize text-[#94774f]">
                        {user.role || "customer"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.isBlocked
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleBlockToggle(user)}
                        disabled={updating === user._id}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium disabled:opacity-50 ${
                          user.isBlocked
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        {updating === user._id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : user.isBlocked ? (
                          <ShieldCheck size={15} />
                        ) : (
                          <ShieldBan size={15} />
                        )}

                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/admin/manage-users/${user._id}`}
                        className="inline-flex items-center gap-2 text-[#94774f] hover:underline"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;
