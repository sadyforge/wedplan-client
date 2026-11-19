
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ShieldCheck, ShieldBan, User } from "lucide-react";
import { GetSingleUser } from "@/lib/actions/users";

interface UserData {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan?: string;
}

const ManageUsersDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await GetSingleUser(id);
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#94774f]" size={30} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">User not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm font-medium text-[#94774f]"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#94774f]"
      >
        <ArrowLeft size={18} />
        Back to Manage Users
      </button>

      <div>
        <p className="text-sm font-medium text-[#94774f]">
          Admin Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#292820]">
          User Details
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          View registered user information and account status.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8e1d7] bg-white">
        <div className="flex flex-col items-center gap-5 border-b border-[#eee8df] bg-[#faf8f5] p-8 sm:flex-row">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e8cda1] text-[#292820]">
              <User size={40} />
            </div>
          )}

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-[#292820]">
              {user.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{user.email}</p>

            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-[#f0e6d8] px-3 py-1 text-xs font-semibold capitalize text-[#94774f]">
                {user.role || "customer"}
              </span>

              <span
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  user.isBlocked
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {user.isBlocked ? (
                  <ShieldBan size={13} />
                ) : (
                  <ShieldCheck size={13} />
                )}
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="mb-6 text-lg font-bold text-[#292820]">
            Personal Information
          </h3>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-gray-400">Full Name</p>
              <p className="mt-2 font-semibold text-[#292820]">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-400">Email Address</p>
              <p className="mt-2 break-all font-semibold text-[#292820]">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-400">User Role</p>
              <p className="mt-2 font-semibold capitalize text-[#292820]">
                {user.role || "customer"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-400">Account Status</p>
              <p
                className={`mt-2 font-semibold ${
                  user.isBlocked ? "text-red-600" : "text-green-600"
                }`}
              >
                {user.isBlocked ? "Blocked" : "Active"}
              </p>
            </div>

            {user.businessName && (
              <div>
                <p className="text-xs font-medium text-gray-400">
                  Business Name
                </p>
                <p className="mt-2 font-semibold text-[#292820]">
                  {user.businessName}
                </p>
              </div>
            )}

            {user.subscriptionPlan && (
              <div>
                <p className="text-xs font-medium text-gray-400">
                  Subscription Plan
                </p>
                <p className="mt-2 font-semibold capitalize text-[#292820]">
                  {user.subscriptionPlan}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersDetailPage;
