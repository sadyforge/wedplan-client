
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
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
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
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Cancelled":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
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
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[2px] text-yellow-500">
            Customer Dashboard
          </p>

          <h1 className="text-3xl font-bold text-white">
            Overview
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Manage your bookings and keep track of your events.
          </p>
        </div>

        <Link
          href="/browse-services"
          className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
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
              className="rounded-xl border border-white/10 bg-[#151515] p-5 transition hover:border-yellow-500/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  {stat.title}
                </p>

                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-white">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#151515] p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">
                Recent Bookings
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Your latest booking requests.
              </p>
            </div>

            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-2 text-sm font-semibold text-yellow-500 transition hover:text-yellow-400"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="py-14 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-gray-500" />

              <h3 className="mt-4 font-semibold text-white">
                No Bookings Yet
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Start exploring services for your next event.
              </p>

              <Link
                href="/browse-services"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
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
                  className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#202020] p-4 sm:flex-row sm:items-center"
                >
                  <div className="h-20 w-full shrink-0 overflow-hidden rounded-lg bg-[#303030] sm:w-24">
                    {booking.serviceImage ? (
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white">
                      {booking.serviceName}
                    </h3>

                    <p className="mt-1 text-sm text-yellow-500">
                      ৳{Number(booking.price).toLocaleString("en-BD")}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
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
          <div className="rounded-xl border border-white/10 bg-[#151515] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
              <CalendarDays className="h-6 w-6 text-yellow-500" />
            </div>

            <h2 className="text-lg font-bold text-white">
              My Bookings
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Check your booking history, track request status and cancel pending requests.
            </p>

            <Link
              href="/dashboard/bookings"
              className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-yellow-500/30 px-4 py-3 text-sm font-semibold text-yellow-500 transition hover:bg-yellow-500/10"
            >
              Manage Bookings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#151515] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
              <CheckCircle2 className="h-6 w-6 text-yellow-500" />
            </div>

            <h2 className="text-lg font-bold text-white">
              Find Your Service
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Discover trusted vendors and find the right services for your special event.
            </p>

            <Link
              href="/browse-services"
              className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
            >
              Browse Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;
