
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
    switch (status.toLowerCase()) {
      case "accepted":
        return "border-green-100 bg-green-50 text-green-700";
      case "rejected":
        return "border-red-100 bg-red-50 text-red-600";
      case "cancelled":
        return "border-gray-200 bg-gray-50 text-gray-600";
      default:
        return "border-amber-100 bg-amber-50 text-amber-700";
    }
  };

  const hasStatus = (booking: Booking, status: Booking["status"]) =>
    booking.status.toLowerCase() === status.toLowerCase();

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[#F8F4EF]">
        <Loader2 className="h-8 w-8 animate-spin text-[#C98291]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-7 bg-[#F8F4EF] px-4 py-8 text-[#302925] sm:px-6 lg:px-8">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#C98291]">
          Vendor Dashboard
        </p>

        <h1 className="text-3xl font-bold text-[#302925]">
          Booking Requests
        </h1>

        <p className="mt-2 text-sm text-[#897A72]">
          Manage booking requests received from your customers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#EDE3DC] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#897A72]">Total Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-[#302925]">
            {bookings.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#EDE3DC] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#897A72]">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-[#C98291]">
            {bookings.filter((item) => hasStatus(item, "Pending")).length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#EDE3DC] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#897A72]">Accepted</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {bookings.filter((item) => hasStatus(item, "Accepted")).length}
          </h2>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8D7BD] bg-white px-5 py-16 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-[#C9BDB6]" />

          <h2 className="mt-4 text-xl font-semibold text-[#302925]">
            No Booking Requests
          </h2>

          <p className="mt-2 text-sm text-[#897A72]">
            Customer booking requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-[#EDE3DC] bg-white p-5 shadow-sm transition hover:border-[#C98291] hover:shadow-md"
            >
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-[#F2EADF] sm:w-48">
                  {booking.serviceImage ? (
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#A89B93]">
                      No Image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-[#302925]">
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

                  <div className="mt-4 space-y-3 text-sm text-[#897A72]">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#C98291]" />
                      {booking.customerName || "N/A"}
                    </p>

                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#C98291]" />
                      {booking.customerEmail}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#C98291]" />
                      {booking.eventDate}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#C98291]" />
                      {booking.eventLocation}
                    </p>
                  </div>

                  {booking.message && (
                    <div className="mt-4 rounded-xl bg-[#FDFBF9] p-3">
                      <p className="text-xs font-semibold text-[#B66E7E]">
                        Customer Message
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#897A72]">
                        {booking.message}
                      </p>
                    </div>
                  )}

                  {hasStatus(booking, "Pending") ? (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={actionLoading === booking._id}
                        onClick={() =>
                          handleStatus(booking._id, "Accepted")
                        }
                        className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                        className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 flex items-center gap-2 text-sm text-[#897A72]">
                      <Clock className="h-4 w-4" />
                      {hasStatus(booking, "Accepted")
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
