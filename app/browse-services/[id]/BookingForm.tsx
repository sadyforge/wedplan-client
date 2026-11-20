
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Loader2,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { CreateBooking } from "@/lib/actions/bookings";

interface Props {
  serviceId: string;
  serviceName: string;
  price: number;
}

const BookingForm = ({ serviceId, serviceName, price }: Props) => {
  const router = useRouter();

  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!eventDate || !eventLocation.trim()) {
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    if (eventDate < today) {
      setError("Please select a valid future date.");
      toast.error("Please select a valid future date.");
      return;
    }

    try {
      setLoading(true);

      const result = await CreateBooking({
        serviceId,
        eventDate,
        eventLocation: eventLocation.trim(),
        message: message.trim(),
      });

      if (result.status === 401) {
        toast.error("Please login to book this service.");
        router.push(`/sign-in?redirect=/browse-services/${serviceId}`);
        return;
      }

      if (!result.success) {
        throw new Error(
          result.message || "Failed to submit booking request."
        );
      }

      const successMessage =
        result.message || "Booking request submitted successfully!";

      setSuccess(successMessage);
      toast.success(successMessage);

      setEventDate("");
      setEventLocation("");
      setMessage("");
    } catch (bookingError) {
      const errorMessage =
        bookingError instanceof Error
          ? bookingError.message
          : "Something went wrong. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#151515] p-6">
        <div className="py-6 text-center">
          <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-green-400" />

          <h2 className="text-2xl font-bold text-white">
            Booking Request Submitted!
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            {success}
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Your booking request for {serviceName} has been submitted.
            You can check your booking status from your dashboard.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/dashboard/bookings"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400"
            >
              <ClipboardList className="h-5 w-5" />
              View My Bookings
            </Link>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="w-full rounded-lg border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
            >
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#151515] p-6">
      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[2px] text-yellow-500">
          Book This Service
        </p>

        <h2 className="text-2xl font-bold text-white">
          Make a Booking
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Send a booking request for {serviceName}.
        </p>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-[#202020] p-4">
          <span className="text-sm text-gray-400">Service Price</span>
          <span className="text-xl font-bold text-yellow-500">
            ৳{Number(price).toLocaleString("en-BD")}
          </span>
        </div>
      </div>

      <form onSubmit={handleBooking} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Event Date *
          </label>

          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-500" />

            <input
              type="date"
              value={eventDate}
              min={today}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#202020] py-3 pl-12 pr-4 text-white outline-none transition focus:border-yellow-500 [color-scheme:dark]"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Event Location *
          </label>

          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-500" />

            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Enter your event location"
              className="w-full rounded-lg border border-white/10 bg-[#202020] py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Additional Message
          </label>

          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-yellow-500" />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more about your event..."
              rows={4}
              className="w-full resize-none rounded-lg border border-white/10 bg-[#202020] py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-500"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Booking Request
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
