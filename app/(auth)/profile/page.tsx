
"use client";

import { useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  Edit3,
  Heart,
  Save,
  X,
  Home,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);

  const role = user?.role || "customer";

  const roleLabel =
    role === "admin"
      ? "Admin"
      : role === "vendor"
        ? "Vendor"
        : "Customer";
  const profileUser = user as typeof user & {
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    createdAt?: string | Date;
  };
  const isPremiumVendor =
    role === "vendor" &&
    String(profileUser?.subscriptionPlan || "free").toLowerCase() === "premium" &&
    String(profileUser?.subscriptionStatus || "inactive").toLowerCase() === "active";

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4EF]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#EDE3DC] border-t-[#C98291]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4EF] px-5">
        <div className="text-center">
          <UserRound className="mx-auto mb-4 text-[#C98291]" size={45} />
          <h2 className="text-2xl font-bold text-[#302925]">
            Please Sign In
          </h2>
          <p className="mt-2 text-sm text-[#897A72]">
            Sign in to view your profile.
          </p>
          <Link
            href="/sign-in"
            className="mt-5 inline-flex rounded-full bg-[#C98291] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#B66F7F]"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();

    if (!name) {
      toast.error("Name is required");
      return;
    }

    const { error } = await authClient.updateUser({
      name,
    });

    if (error) {
      toast.error(error.message || "Profile update failed!");
      return;
    }

    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <section className="min-h-screen bg-[#F8F4EF] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8D5D3] bg-white px-5 py-2.5 text-sm font-semibold text-[#514640] shadow-sm transition hover:border-[#C98291] hover:bg-[#F4E6E2] hover:text-[#B66F7F]"
        >
          <Home size={17} />
          Back to Home
        </Link>

        <div className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F4E6E2] px-4 py-2 text-xs font-semibold text-[#B66F7F]">
            <Heart size={14} />
            My Account
          </span>

          <h1 className="mt-4 text-3xl font-bold text-[#302925] sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-sm text-[#897A72]">
            Manage your personal information and account details.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#EDE3DC] bg-white shadow-sm">
          <div className="relative h-48 bg-gradient-to-r from-[#302925] via-[#59413F] to-[#C98291] sm:h-56">
            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full border border-white/10" />

            <div className="absolute bottom-5 left-6 text-white sm:left-10">
              <p className="text-sm text-white/70">Welcome to WedPlan</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                Your Personal Space
              </h2>
            </div>
          </div>

          <div className="px-6 pb-8 sm:px-10">
            <div className="-mt-14 flex flex-col justify-between gap-5 sm:-mt-16 sm:flex-row sm:items-end">
              <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#F4E6E2] text-4xl font-bold text-[#B66F7F] shadow-md sm:h-32 sm:w-32">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E8D5D3] px-5 py-3 text-sm font-semibold text-[#B66F7F] transition hover:bg-[#F8F0EE]"
              >
                {isEditing ? <X size={17} /> : <Edit3 size={17} />}
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>

            <div className="mt-5">
              <h2 className="text-2xl font-bold text-[#302925]">
                {user.name}
              </h2>
              <p className="mt-1 text-sm text-[#897A72]">{user.email}</p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F4E6E2] px-4 py-2 text-xs font-semibold text-[#B66F7F]">
                <ShieldCheck size={15} />
                {roleLabel}
              </span>
              {isPremiumVendor && (
                <span className="ml-2 mt-4 inline-flex rounded-full bg-[#F9E9EC] px-4 py-2 text-xs font-bold tracking-wide text-[#B66E7E]">
                  PREMIUM
                </span>
              )}
            </div>

            <div className="my-8 h-px bg-[#EDE3DC]" />

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <h3 className="text-lg font-bold text-[#302925]">
                  Edit Personal Information
                </h3>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#302925]">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B7A69B]"
                    />
                    <input
                      name="name"
                      type="text"
                      defaultValue={user.name}
                      required
                      className="w-full rounded-xl border border-[#EDE3DC] bg-[#FDFBF9] py-4 pl-11 pr-4 text-sm text-[#302925] outline-none transition focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#302925]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B7A69B]"
                    />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-[#EDE3DC] bg-[#F5F1ED] py-4 pl-11 pr-4 text-sm text-[#897A72] outline-none"
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#897A72]">
                    Email address cannot be changed here.
                  </p>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C98291] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#C98291]/20 transition hover:bg-[#B66F7F]"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </form>
            ) : (
              <div>
                <h3 className="mb-6 text-lg font-bold text-[#302925]">
                  Personal Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex items-start gap-4 rounded-2xl border border-[#EDE3DC] bg-[#FDFBF9] p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4E6E2] text-[#B66F7F]">
                      <UserRound size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#897A72]">Full Name</p>
                      <p className="mt-2 break-words text-sm font-semibold text-[#302925]">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  {role === "vendor" && (
                    <div className="flex items-start gap-4 rounded-2xl border border-[#EDE3DC] bg-[#FDFBF9] p-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4E6E2] text-[#B66F7F]">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-[#897A72]">Subscription</p>
                        <p className="mt-2 text-sm font-semibold text-[#302925]">
                          {isPremiumVendor ? "Premium" : "Free"}
                        </p>
                        <p className="mt-1 text-xs capitalize text-[#897A72]">
                          {isPremiumVendor ? "Active" : "Inactive"}
                        </p>
                        {isPremiumVendor && (
                          <span className="mt-2 inline-flex rounded-full bg-[#F9E9EC] px-2 py-0.5 text-[9px] font-bold tracking-wide text-[#B66E7E]">
                            PREMIUM
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4 rounded-2xl border border-[#EDE3DC] bg-[#FDFBF9] p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4E6E2] text-[#B66F7F]">
                      <Mail size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#897A72]">Email Address</p>
                      <p className="mt-2 break-all text-sm font-semibold text-[#302925]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-[#EDE3DC] bg-[#FDFBF9] p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4E6E2] text-[#B66F7F]">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#897A72]">Account Role</p>
                      <p className="mt-2 text-sm font-semibold capitalize text-[#302925]">
                        {roleLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-[#EDE3DC] bg-[#FDFBF9] p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4E6E2] text-[#B66F7F]">
                      <CalendarDays size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#897A72]">Account Status</p>
                      <p className="mt-2 text-sm font-semibold text-[#302925]">
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
