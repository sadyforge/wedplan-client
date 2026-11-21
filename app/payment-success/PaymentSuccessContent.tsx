
"use client";

import Link from "next/link";
import { useEffect, use, useState } from "react";
import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";
import {
  VerifyCheckoutSession,
  GetMySubscription,
} from "@/lib/actions/payments";

type PaymentState = "loading" | "success" | "pending" | "error";

export default function PaymentSuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = use(searchParams);

  const [state, setState] = useState<PaymentState>(
    sessionId ? "loading" : "error"
  );

  const [message, setMessage] = useState(
    sessionId
      ? "Confirming your payment..."
      : "Payment session information is missing."
  );

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    let attempts = 0;

    const verifyUntilActive = async () => {
      try {
        while (!cancelled && attempts < 15) {
          attempts += 1;

          // Verify Checkout Session with backend
          await VerifyCheckoutSession(sessionId);

          // Check actual subscription status from database
          const result = await GetMySubscription();

          const subscriptionStatus = String(
            result?.subscriptionStatus ||
              result?.subscription?.subscriptionStatus ||
              result?.subscription?.status ||
              result?.data?.subscriptionStatus ||
              result?.data?.subscription?.status ||
              ""
          ).toLowerCase();

          const isPremiumActive =
            subscriptionStatus === "active" ||
            subscriptionStatus === "trialing";

          if (cancelled) return;

          if (isPremiumActive) {
            setState("success");
            setMessage(
              "Your Premium subscription has been activated successfully."
            );
            return;
          }

          setMessage(
            "Payment received. Waiting for Stripe to confirm your subscription..."
          );

          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (!cancelled) {
          setState("pending");
          setMessage(
            "Your payment has been received, but subscription activation is taking longer than usual. Please check your subscription status shortly."
          );
        }
      } catch (error) {
        if (!cancelled) {
          setState("error");
          setMessage(
            error instanceof Error
              ? error.message
              : "Payment verification failed."
          );
        }
      }
    };

    verifyUntilActive();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F4EF] px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-[#EADDE0] bg-white p-8 text-center shadow-[0_8px_30px_rgba(80,50,50,0.06)]">
        {state === "loading" ? (
          <Loader2
            className="mx-auto animate-spin text-[#C98291]"
            size={56}
          />
        ) : state === "success" ? (
          <CheckCircle2
            className="mx-auto text-green-600"
            size={56}
          />
        ) : state === "pending" ? (
          <Clock className="mx-auto text-[#C98291]" size={56} />
        ) : (
          <XCircle className="mx-auto text-red-500" size={56} />
        )}

        <h1 className="mt-5 text-2xl font-bold text-[#302925]">
          {state === "loading"
            ? "Confirming payment"
            : state === "success"
              ? "Premium activated"
              : state === "pending"
                ? "Payment processing"
                : "Payment verification failed"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#8B8179]">
          {message}
        </p>

        <Link
          href="/dashboard/vendor"
          className="mt-6 inline-flex rounded-xl bg-[#C98291] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B66E7E]"
        >
          Back to vendor dashboard
        </Link>
      </section>
    </main>
  );
}
