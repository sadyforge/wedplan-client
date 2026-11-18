
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  UserRound,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
  ];

  const role = String(
    (user as { role?: string } | undefined)?.role || "customer",
  )
    .toLowerCase()
    .trim();

  const roleDetails = {
    admin: {
      label: "Admin",
      dashboardLabel: "Admin Hub",
      dashboardHref: "/dashboard/admin",
    },
    vendor: {
      label: "Vendor",
      dashboardLabel: "Vendor Hub",
      dashboardHref: "/dashboard/vendor",
    },
    customer: {
      label: "Customer",
      dashboardLabel: "Customer Hub",
      dashboardHref: "/dashboard/customer",
    },
  } as const;

  const currentRole =
    roleDetails[role as keyof typeof roleDetails] || roleDetails.customer;
  const roleLabel = currentRole.label;
  const dashboardLabel = currentRole.dashboardLabel;
  const dashboardHref = currentRole.dashboardHref;

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message || "Sign out failed!");
      return;
    }

    toast.success("Successfully signed out!");
    setIsOpen(false);
    setIsProfileOpen(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#EDE3DC] bg-[#F8F4EF]/95 text-[#302925] backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Wed<span className="text-[#C98291]">Plan</span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative text-sm font-medium transition ${
                pathname === link.href
                  ? "text-[#C98291]"
                  : "text-[#665B55] hover:text-[#C98291]"
              }`}
            >
              {link.name}

              {pathname === link.href && (
                <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-[#C98291]" />
              )}
            </Link>
          ))}

          {user && (
            <Link
              href={dashboardHref}
              className={`relative text-sm font-medium transition ${
                pathname === dashboardHref
                  ? "text-[#C98291]"
                  : "text-[#665B55] hover:text-[#C98291]"
              }`}
            >
              {dashboardLabel}

              {pathname === dashboardHref && (
                <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-[#C98291]" />
              )}
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!isPending &&
            (user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 rounded-full border border-[#EDE3DC] bg-white px-3 py-2 transition hover:border-[#C98291]"
                  aria-expanded={isProfileOpen}
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4E6E2] text-sm font-bold text-[#B66F7F]">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <div className="text-left">
                    <p className="max-w-32 truncate text-sm font-semibold text-[#302925]">
                      {user.name}
                    </p>
                    <p className="text-xs text-[#897A72]">{roleLabel}</p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`text-[#897A72] transition ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-[#EDE3DC] bg-white shadow-xl">
                    <div className="border-b border-[#EDE3DC] bg-[#FDFBF9] p-4">
                      <p className="font-semibold text-[#302925]">
                        {user.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-[#897A72]">
                        {user.email}
                      </p>
                      <span className="mt-3 inline-flex rounded-full bg-[#F4E6E2] px-3 py-1 text-xs font-semibold text-[#B66F7F]">
                        {roleLabel}
                      </span>
                    </div>

                    <div className="p-2">
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#514640] transition hover:bg-[#F8F4EF] hover:text-[#C98291]"
                      >
                        <LayoutDashboard size={18} />
                        {dashboardLabel}
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#514640] transition hover:bg-[#F8F4EF] hover:text-[#C98291]"
                      >
                        <UserRound size={18} />
                        My Profile
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-500 transition hover:bg-red-50"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-full px-5 py-2.5 text-sm font-medium text-[#514640] transition hover:text-[#C98291]"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-full bg-[#C98291] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B66F7F]"
                >
                  Get Started
                </Link>
              </>
            ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#302925] transition hover:bg-[#F4E6E2] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[#EDE3DC] bg-[#F8F4EF] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-[#F4E6E2] text-[#C98291]"
                    : "text-[#665B55] hover:bg-[#F4E6E2]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {!isPending &&
              user && (
                <Link
                  href={dashboardHref}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    pathname === dashboardHref
                      ? "bg-[#F4E6E2] text-[#C98291]"
                      : "text-[#665B55] hover:bg-[#F4E6E2]"
                  }`}
                >
                  {dashboardLabel}
                </Link>
              )}

            {!isPending &&
              (user ? (
                <div className="border-t border-[#EDE3DC] pt-4">
                  <div className="flex items-center gap-3 px-3 py-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4E6E2] font-bold text-[#B66F7F]">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#302925]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#897A72]">
                        {user.email}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#B66F7F]">
                        {roleLabel}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#514640] hover:bg-[#F4E6E2]"
                    >
                      <UserRound size={18} />
                      My Profile
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 border-t border-[#EDE3DC] pt-4">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full border border-[#E8D5D3] py-2.5 text-center text-sm font-medium text-[#514640]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full bg-[#C98291] py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
