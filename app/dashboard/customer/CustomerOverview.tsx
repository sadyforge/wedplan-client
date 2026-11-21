
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { GetMyBookings } from "@/lib/actions/bookings";

interface Booking {
  _id: string;
  serviceName: string;
  serviceImage: string;
  price: number;
  vendorName: string;
  eventDate: string;
  eventLocation: string;
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled";
  createdAt: string;
}

const CustomerOverview = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await GetMyBookings();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch bookings.");
        }

        setBookings(result.data || []);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: ClipboardList,
      color: "text-[#C98291]",
      bg: "bg-[#F9E9EC]",
    },
    {
      title: "Pending",
      value: bookings.filter((item) => item.status === "Pending").length,
      icon: Clock,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Accepted",
      value: bookings.filter((item) => item.status === "Accepted").length,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Rejected",
      value: bookings.filter((item) => item.status === "Rejected").length,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  ];

  const getStatusStyle = (status: Booking["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-green-50 text-green-700 border-green-100";
      case "Rejected":
        return "bg-red-50 text-red-600 border-red-100";
      case "Cancelled":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C98291]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EF] px-4 py-8 text-[#302925] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-[#C98291]">
            <Sparkles className="h-4 w-4" />
            Customer Dashboard
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Overview
          </h1>

          <p className="mt-2 text-sm text-[#8B8179] sm:text-base">
            Manage your bookings and keep track of your events.
          </p>
        </div>

        <Link
          href="/browse-services"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#C98291] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B86F80]"
        >
          <Plus className="h-5 w-5" />
          Explore Services
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#EDE3DA] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#302925]/5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#8B8179]">
                  {stat.title}
                </p>

                <div className={`rounded-xl p-3 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-semibold">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#EDE3DA] bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                Recent Bookings
              </h2>

              <p className="mt-1 text-sm text-[#8B8179]">
                Your latest booking requests.
              </p>
            </div>

            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-2 text-sm font-semibold text-[#C98291] transition hover:text-[#B86F80]"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="py-14 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-[#C98291]" />

              <h3 className="mt-4 font-semibold">
                No Bookings Yet
              </h3>

              <p className="mt-2 text-sm text-[#8B8179]">
                Start exploring services for your next event.
              </p>

              <Link
                href="/browse-services"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C98291] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B86F80]"
              >
                Browse Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-col gap-4 rounded-xl border border-[#EDE3DA] bg-[#FCFAF8] p-4 sm:flex-row sm:items-center"
                >
                  <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-[#F1EAE3] sm:w-24">
                    {booking.serviceImage ? (
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[#A49A92]">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#302925]">
                      {booking.serviceName}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-[#C98291]">
                      ৳{Number(booking.price).toLocaleString("en-BD")}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#8B8179]">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {booking.eventDate}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {booking.eventLocation}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[#EDE3DA] bg-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9E9EC]">
              <CalendarDays className="h-6 w-6 text-[#C98291]" />
            </div>

            <h2 className="text-lg font-semibold">
              My Bookings
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8B8179]">
              Check your booking history, track request status and cancel pending requests.
            </p>

            <Link
              href="/dashboard/bookings"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#E7C5CC] px-4 py-3 text-sm font-semibold text-[#B87583] transition hover:bg-[#F9E9EC]"
            >
              Manage Bookings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-[#EDE3DA] bg-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9E9EC]">
              <CheckCircle2 className="h-6 w-6 text-[#C98291]" />
            </div>

            <h2 className="text-lg font-semibold">
              Find Your Service
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8B8179]">
              Discover trusted vendors and find the right services for your special event.
            </p>

            <Link
              href="/browse-services"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#C98291] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#B86F80]"
            >
              Browse Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
};

export default CustomerOverview;
