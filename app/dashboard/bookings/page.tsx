
"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Loader2,
  MapPin,
  ClipboardList,
  Ban,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  GetMyBookings,
  CancelBooking,
} from "@/lib/actions/bookings";

interface Booking {
  _id: string;
  serviceName: string;
  serviceImage: string;
  price: number;
  vendorName: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled";
  createdAt: string;
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);

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

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      setActionLoading(id);

      const result = await CancelBooking(id);

      if (!result.success) {
        throw new Error(result.message || "Failed to cancel booking.");
      }

      toast.success(result.message || "Booking cancelled successfully.");

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
        return "border-green-100 bg-green-50 text-green-700";
      case "Rejected":
        return "border-red-100 bg-red-50 text-red-600";
      case "Cancelled":
        return "border-gray-200 bg-gray-100 text-gray-600";
      default:
        return "border-amber-100 bg-amber-50 text-amber-700";
    }
  };

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
      <div>
        <p className="mb-2 text-sm font-medium text-[#C98291]">
          Dashboard
        </p>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          My Bookings
        </h1>

        <p className="mt-2 text-sm text-[#8B8179] sm:text-base">
          Manage and track your service booking requests.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#EDE3DA] bg-white p-5">
          <p className="text-sm text-[#8B8179]">Total Bookings</p>
          <h2 className="mt-2 text-3xl font-semibold">
            {bookings.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#EDE3DA] bg-white p-5">
          <p className="text-sm text-[#8B8179]">Pending</p>
          <h2 className="mt-2 text-3xl font-semibold text-amber-600">
            {bookings.filter((item) => item.status === "Pending").length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#EDE3DA] bg-white p-5">
          <p className="text-sm text-[#8B8179]">Accepted</p>
          <h2 className="mt-2 text-3xl font-semibold text-green-600">
            {bookings.filter((item) => item.status === "Accepted").length}
          </h2>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCCFC3] bg-white px-5 py-16 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-[#C98291]" />

          <h2 className="mt-4 text-xl font-semibold">
            No Bookings Found
          </h2>

          <p className="mt-2 text-sm text-[#8B8179]">
            You have not booked any services yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-[#EDE3DA] bg-white p-5 transition hover:shadow-md hover:shadow-[#302925]/5"
            >
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-[#F1EAE3] sm:w-48">
                  {booking.serviceImage ? (
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#A49A92]">
                      No Image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {booking.serviceName}
                      </h2>

                      <p className="mt-1 text-lg font-semibold text-[#C98291]">
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

                  <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-[#8B8179] sm:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#C98291]" />
                      {booking.eventDate}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#C98291]" />
                      {booking.eventLocation}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-[#F0EAE4] pt-4">
                    <p className="text-sm text-[#8B8179]">
                      Vendor:{" "}
                        <span className="text-[#302925]">
                        {booking.vendorName || "N/A"}
                      </span>
                    </p>

                    {booking.message && (
                      <p className="mt-3 text-sm leading-6 text-[#8B8179]">
                        Message: {booking.message}
                      </p>
                    )}
                  </div>

                  {booking.status === "Pending" ? (
                    <div className="mt-5">
                      <button
                        type="button"
                        disabled={actionLoading === booking._id}
                        onClick={() => handleCancel(booking._id)}
                        className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actionLoading === booking._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                        Cancel Booking
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 text-[#A49A92]" />

                      {booking.status === "Accepted"
                        ? "Your booking has been accepted."
                        : booking.status === "Rejected"
                          ? "Your booking has been rejected."
                          : "You cancelled this booking."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </main>
  );
};

export default Bookings;
