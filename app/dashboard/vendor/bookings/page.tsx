
"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Loader2,
  MapPin,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  GetVendorBookings,
  UpdateBookingStatus,
} from "@/lib/actions/bookings";

interface Booking {
  _id: string;
  serviceName: string;
  serviceImage: string;
  price: number;
  customerName: string;
  customerEmail: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled";
  createdAt: string;
}

const VendorBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const result = await GetVendorBookings();

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

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatus = async (
    id: string,
    status: "Accepted" | "Rejected"
  ) => {
    try {
      setActionLoading(id);

      const result = await UpdateBookingStatus(id, status);

      if (!result.success) {
        throw new Error(result.message || "Failed to update booking.");
      }

      toast.success(result.message || `Booking ${status.toLowerCase()} successfully.`);

      await fetchBookings();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setActionLoading("");
    }
  };

  const getStatusStyle = (status: Booking["status"]) => {
    switch (status) {
      case "Accepted":
        return "border-green-500/20 bg-green-500/10 text-green-400";
      case "Rejected":
        return "border-red-500/20 bg-red-500/10 text-red-400";
      case "Cancelled":
        return "border-gray-500/20 bg-gray-500/10 text-gray-400";
      default:
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[2px] text-yellow-500">
          Vendor Dashboard
        </p>

        <h1 className="text-3xl font-bold text-white">
          Booking Requests
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Manage booking requests received from your customers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#151515] p-5">
          <p className="text-sm text-gray-400">Total Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {bookings.length}
          </h2>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#151515] p-5">
          <p className="text-sm text-gray-400">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-500">
            {bookings.filter((item) => item.status === "Pending").length}
          </h2>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#151515] p-5">
          <p className="text-sm text-gray-400">Accepted</p>
          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {bookings.filter((item) => item.status === "Accepted").length}
          </h2>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#151515] px-5 py-16 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-500" />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No Booking Requests
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Customer booking requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="overflow-hidden rounded-xl border border-white/10 bg-[#151515] p-5"
            >
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg bg-[#202020] sm:w-48">
                  {booking.serviceImage ? (
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {booking.serviceName}
                      </h2>

                      <p className="mt-1 text-lg font-semibold text-yellow-500">
                        ৳{Number(booking.price).toLocaleString("en-BD")}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-gray-400">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-yellow-500" />
                      {booking.customerName || "N/A"}
                    </p>

                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-yellow-500" />
                      {booking.customerEmail}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-yellow-500" />
                      {booking.eventDate}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-yellow-500" />
                      {booking.eventLocation}
                    </p>
                  </div>

                  {booking.message && (
                    <div className="mt-4 rounded-lg bg-[#202020] p-3">
                      <p className="text-xs font-semibold text-yellow-500">
                        Customer Message
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {booking.message}
                      </p>
                    </div>
                  )}

                  {booking.status === "Pending" ? (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={actionLoading === booking._id}
                        onClick={() =>
                          handleStatus(booking._id, "Accepted")
                        }
                        className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actionLoading === booking._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        Accept
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading === booking._id}
                        onClick={() =>
                          handleStatus(booking._id, "Rejected")
                        }
                        className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {booking.status === "Accepted"
                        ? "This booking has been accepted."
                        : booking.status === "Rejected"
                          ? "This booking has been rejected."
                          : "This booking is no longer active."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorBooking;
