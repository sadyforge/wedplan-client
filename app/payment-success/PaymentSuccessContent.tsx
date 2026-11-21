"use client";

import Link from "next/link";
import { useEffect, use, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { VerifyCheckoutSession } from "@/lib/actions/payments";

export default function PaymentSuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = use(searchParams);
  const [state, setState] = useState<"loading" | "success" | "error">(sessionId ? "loading" : "error");
  const [message, setMessage] = useState(sessionId ? "Confirming your payment..." : "Payment session information is missing.");

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const verifyUntilActive = async () => {
      while (!cancelled && attempts < 15) {
        attempts += 1;
        try {
          const result = await VerifyCheckoutSession(sessionId);
        const subscriptionStatus = String(
          result?.subscriptionStatus ||
            result?.subscription?.status ||
            result?.data?.subscriptionStatus ||
            ""
        ).toLowerCase();
        const verified = result?.verified === true || subscriptionStatus === "active";

          if (result?.success === false && !result?.pending) {
            throw new Error(result.message || "Payment verification failed.");
          }

          if (verified) {
            setState("success");
            setMessage("Your Premium subscription has been activated.");
            return;
          }

          setMessage("Payment received. Confirming your Premium subscription...");
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
          if (!cancelled) {
            setState("error");
            setMessage(error instanceof Error ? error.message : "Payment verification failed.");
          }
          return;
        }
      }

      if (!cancelled) {
        setMessage("Payment received. Stripe confirmation is taking longer than usual. Please refresh shortly.");
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
        {state === "loading" ? <Loader2 className="mx-auto animate-spin text-[#C98291]" size={56} /> : state === "success" ? <CheckCircle2 className="mx-auto text-green-600" size={56} /> : <XCircle className="mx-auto text-red-500" size={56} />}
        <h1 className="mt-5 text-2xl font-bold text-[#302925]">{state === "loading" ? "Confirming payment" : state === "success" ? "Premium activated" : "Payment verification failed"}</h1>
        <p className="mt-3 text-sm leading-6 text-[#8B8179]">{message}</p>
        <Link href="/dashboard/vendor" className="mt-6 inline-flex rounded-xl bg-[#C98291] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B66E7E]">Back to vendor dashboard</Link>
      </section>
    </main>
  );
}
