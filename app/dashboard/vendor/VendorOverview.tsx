
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  ClipboardList,
  Crown,
  Plus,
  ArrowRight,
  Loader2,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { GetServices } from "@/lib/actions/services";
import { GetVendorBookings } from "@/lib/actions/bookings";

interface Props {
  vendorId: string;
  vendorEmail: string;
  subscriptionPlan: string;
}

interface Service {
  _id: string;
  serviceName: string;
  image?: string;
  images?: string[];
  price: number;
  vendorId?: string;
  vendorEmail?: string;
  status: "pending" | "approved" | "rejected";
}

interface Booking {
  _id: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  eventDate: string;
  eventLocation: string;
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled";
  createdAt: string;
}

const VendorOverview = ({
  vendorId,
  vendorEmail,
  subscriptionPlan,
}: Props) => {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [serviceResult, bookingResult] = await Promise.all([
          GetServices(),
          GetVendorBookings(),
        ]);

        if (serviceResult.success === false) {
          throw new Error(
            serviceResult.message || "Failed to fetch services."
          );
        }

        if (!bookingResult.success) {
          throw new Error(
            bookingResult.message || "Failed to fetch bookings."
          );
        }

        const allServices = Array.isArray(serviceResult)
          ? serviceResult
          : serviceResult.data || [];

        const myServices = allServices.filter(
          (service: Service) =>
            String(service.vendorId || "") === String(vendorId) ||
            service.vendorEmail?.toLowerCase() ===
              vendorEmail.toLowerCase()
        );

        setServices(myServices);
        setBookings(bookingResult.data || []);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [vendorId, vendorEmail]);

  const activeServices = services.filter(
    (service) => service.status === "approved"
  );

  const pendingServices = services.filter(
    (service) => service.status === "pending"
  );

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  );

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "Accepted"
  );

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      title: "Total Services",
      value: services.length,
      icon: BriefcaseBusiness,
      color: "text-[#C98291]",
      bg: "bg-[#F9E9EC]",
    },
    {
      title: "Active Services",
      value: activeServices.length,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Pending Requests",
      value: pendingBookings.length,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Accepted Bookings",
      value: acceptedBookings.length,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[#F8F4EF]">
        <Loader2 className="h-8 w-8 animate-spin text-[#C98291]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 bg-[#F8F4EF] px-4 py-8 text-[#302925] sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#C98291]">
            Vendor Dashboard
          </p>

          <h1 className="text-3xl font-bold text-[#302925]">
            Overview
          </h1>

          <p className="mt-2 text-sm text-[#897A72]">
            Manage your services and keep track of customer bookings.
          </p>
        </div>

        <Link
          href="/dashboard/services/add"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#C98291] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B66E7E]"
        >
          <Plus className="h-5 w-5" />
          Add New Service
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#EDE3DC] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#C98291] hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#897A72]">
                  {stat.title}
                </p>

                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#302925]">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#EDE3DC] bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#302925]">
                Recent Booking Requests
              </h2>

              <p className="mt-1 text-sm text-[#897A72]">
                Latest bookings from your customers.
              </p>
            </div>

            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-2 text-sm font-semibold text-[#C98291] transition hover:text-[#B66E7E]"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="py-14 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-[#C9BDB6]" />

              <h3 className="mt-4 font-semibold text-[#302925]">
                No Booking Requests
              </h3>

              <p className="mt-2 text-sm text-[#897A72]">
                Customer booking requests will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-xl border border-[#EDE3DC] bg-[#FDFBF9] p-4"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-semibold text-[#302925]">
                        {booking.serviceName}
                      </h3>

                      <p className="mt-1 text-sm text-[#897A72]">
                        Customer: {booking.customerName}
                      </p>

                      <p className="mt-1 text-xs text-[#A89B93]">
                        {booking.customerEmail}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                        booking.status === "Accepted"
                          ? "border-green-100 bg-green-50 text-green-700"
                          : booking.status === "Rejected"
                            ? "border-red-100 bg-red-50 text-red-600"
                            : booking.status === "Cancelled"
                              ? "border-gray-200 bg-gray-50 text-gray-600"
                              : "border-amber-100 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 border-t border-[#EDE3DC] pt-3 text-xs text-[#897A72]">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-[#C98291]" />
                      {booking.eventDate}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#C98291]" />
                      {booking.eventLocation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[#EADDE0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9E9EC]">
                <Crown className="h-6 w-6 text-[#C98291]" />
              </div>

              <span className="rounded-full border border-[#EADDE0] bg-[#FFF8F8] px-3 py-1 text-xs font-semibold text-[#B66E7E]">
                Current Plan
              </span>
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#302925]">
              {subscriptionPlan}
            </h2>

            <p className="mt-2 text-sm text-[#897A72]">
              Your current vendor subscription plan.
            </p>

            <Link
              href="/dashboard/vendor/subscription"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#EADDE0] px-4 py-3 text-sm font-semibold text-[#B66E7E] transition hover:bg-[#FFF8F8]"
            >
              Manage Subscription
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-[#EDE3DC] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#302925]">
              Service Summary
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#897A72]">
                  Approved Services
                </span>
                <span className="font-semibold text-green-600">
                  {activeServices.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#897A72]">
                  Pending Approval
                </span>
                <span className="font-semibold text-[#C98291]">
                  {pendingServices.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#897A72]">
                  Rejected Services
                </span>
                <span className="font-semibold text-red-500">
                  {services.filter(
                    (service) => service.status === "rejected"
                  ).length}
                </span>
              </div>
            </div>

            <Link
              href="/dashboard/services"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#C98291] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#B66E7E]"
            >
              Manage Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOverview;
