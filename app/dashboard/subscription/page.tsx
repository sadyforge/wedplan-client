
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  BriefcaseBusiness,
  ArrowRight,
  Loader2,
  Star,
  Infinity,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const SubscriptionPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);

  const user = session?.user as
    | {
        id: string;
        subscriptionPlan?: string;
        subscriptionExpiresAt?: string;
      }
    | undefined;

  const currentPlan = user?.subscriptionPlan || "free";
  const isPremium = currentPlan === "premium";

  const handleUpgrade = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${baseUrl}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error(result.message || "Unable to start checkout.");
        return;
      }

      if (result.url) {
        window.location.href = result.url;
        return;
      }

      toast.error("Checkout URL was not provided.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#C98291]" size={32} />
      </div>
    );
  }

  const plans = [
    {
      name: "Free",
      description: "Everything you need to get started.",
      price: "$0",
      period: "Forever",
      icon: BriefcaseBusiness,
      features: [
        "Maximum 3 Active Services",
        "Basic Vendor Dashboard",
        "Booking Request Management",
        "Manage Your Wedding Services",
        "Customer Booking Notifications",
      ],
    },
    {
      name: "Premium",
      description: "Grow your wedding business without limits.",
      price: "Paid Plan",
      period: "Subscription",
      icon: Crown,
      popular: true,
      features: [
        "Unlimited Active Services",
        "Premium Vendor Badge",
        "All Free Plan Features",
        "More Opportunities to Grow",
        "Professional Vendor Presence",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EF] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F9E9EC] text-[#C98291]">
            <Crown size={28} />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#C98291]">
            WedPlan Membership
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#302925] sm:text-4xl">
            Choose Your Subscription Plan
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#8B8179] sm:text-base">
            Choose the right plan for your wedding business.
            Upgrade to Premium and publish unlimited services.
          </p>
        </div>

        {/* Current Plan */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#EAD4B5] bg-[#F5EDE2] p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#B98742]">
              {isPremium ? (
                <Crown size={24} />
              ) : (
                <BriefcaseBusiness size={24} />
              )}
            </div>

            <div>
              <p className="text-sm text-[#8B8179]">
                Your Current Plan
              </p>

              <h2 className="mt-1 font-serif text-xl font-bold text-[#302925]">
                {isPremium ? "Premium Plan" : "Free Plan"}
              </h2>
            </div>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              isPremium
                ? "bg-amber-100 text-amber-700"
                : "bg-white text-[#8B8179]"
            }`}
          >
            {isPremium ? "Premium Member" : "Free Member"}
          </span>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const Icon = plan.icon;

            const isCurrent =
              plan.name.toLowerCase() === currentPlan;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg sm:p-8 ${
                  plan.popular
                    ? "border-[#C98291] shadow-md"
                    : "border-[#EDE3DA]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#C98291] px-4 py-1.5 text-xs font-semibold text-white">
                    <Star size={13} />
                    Recommended
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9E9EC] text-[#C98291]">
                    <Icon size={24} />
                  </div>

                  {isCurrent && (
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      Current Plan
                    </span>
                  )}
                </div>

                <h2 className="mt-6 font-serif text-2xl font-bold text-[#302925]">
                  {plan.name}
                </h2>

                <p className="mt-2 text-sm text-[#8B8179]">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-end gap-2">
                  <span className="font-serif text-4xl font-bold text-[#302925]">
                    {plan.price}
                  </span>

                  <span className="mb-1 text-sm text-[#A49A91]">
                    / {plan.period}
                  </span>
                </div>

                <div className="my-7 h-px bg-[#F0EAE4]" />

                <p className="mb-5 text-sm font-semibold text-[#302925]">
                  What&apos;s included
                </p>

                <ul className="flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-[#6F665F]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F9E9EC] text-[#C98291]">
                        <Check size={13} />
                      </span>

                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.name === "Free" ? (
                  <button
                    type="button"
                    disabled
                    className={`mt-8 w-full rounded-xl border px-5 py-3 text-sm font-semibold ${
                      isCurrent
                        ? "border-[#C98291] bg-[#F9E9EC] text-[#B87583]"
                        : "border-[#EDE3DA] bg-[#F8F4EF] text-[#A49A91]"
                    }`}
                  >
                    {isCurrent ? "Your Current Plan" : "Free Plan"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    disabled={isPremium || loading}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C98291] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B87583] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Redirecting...
                      </>
                    ) : isPremium ? (
                      <>
                        <ShieldCheck size={17} />
                        Already Premium
                      </>
                    ) : (
                      <>
                        <Sparkles size={17} />
                        Upgrade to Premium
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Information */}
        <div className="rounded-2xl border border-[#EDE3DA] bg-white p-5 text-center sm:p-6">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F9E9EC] text-[#C98291]">
            <ShieldCheck size={22} />
          </div>

          <h3 className="font-serif text-lg font-bold text-[#302925]">
            Secure Payments with Stripe
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#8B8179]">
            Your Premium access will be activated only after
            successful payment verification through our secure
            payment webhook.
          </p>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionPage;
