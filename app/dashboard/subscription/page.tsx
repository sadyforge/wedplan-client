
import { requireDashboardRole } from "@/lib/dashboard-auth";
import { authFetch } from "@/lib/core/server";
import {
  Check,
  Crown,
  Zap,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  CreditCard,
  Clock,
} from "lucide-react";
import UpgradeButton from "./UpgradeButton";
import CancelButton from "./CancelButton";

export const instant = false;

const SubscriptionPage = async ({ searchParams }: { searchParams: Promise<{ plan?: string; canceled?: string }> }) => {
   const { canceled } = await searchParams

  if (canceled) {
    console.log(
      'Order canceled -- continue to shop around and check out when you\'re ready.'
    )
  }
  await requireDashboardRole(["vendor"]);
  const { session } = await requireDashboardRole(["vendor"]);
  const sessionUser = session.user as {
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    subscriptionExpiresAt?: string | Date;
    subscriptionStartedAt?: string | Date;
    subscriptionCancelledAt?: string | Date;
    subscriptionCancelAtPeriodEnd?: boolean;
  };
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  let remoteSubscription: Record<string, unknown> = {};
  let subscriptionError = "";
  let transactionError = "";
  let transactions: Array<Record<string, unknown>> = [];

  try {
    const [subscriptionResponse, transactionsResponse] = await Promise.all([
      authFetch(`${baseUrl}/payments/my-subscription`),
      authFetch(`${baseUrl}/payments/my-transactions`),
    ]);
    const subscriptionResult = await subscriptionResponse.json().catch(() => ({}));
    const transactionResult = await transactionsResponse.json().catch(() => ({}));
    const source = (subscriptionResult?.data?.subscription || subscriptionResult?.subscription || subscriptionResult?.data || subscriptionResult || {}) as Record<string, unknown>;
    remoteSubscription = {
      ...source,
      subscriptionPlan: source.subscriptionPlan || source.plan,
      subscriptionStatus: source.subscriptionStatus || source.status,
      subscriptionStartedAt: source.subscriptionStartedAt || source.currentPeriodStart || source.current_period_start,
      subscriptionExpiresAt: source.subscriptionExpiresAt || source.currentPeriodEnd || source.current_period_end,
      subscriptionCancelledAt: source.subscriptionCancelledAt || source.cancelledAt || source.canceled_at,
      subscriptionCancelAtPeriodEnd: source.subscriptionCancelAtPeriodEnd ?? source.cancelAtPeriodEnd ?? source.cancel_at_period_end,
    };
    if (!subscriptionResponse.ok) {
      throw new Error(subscriptionResult?.message || "Failed to fetch subscription.");
    }
    transactions = Array.isArray(transactionResult)
      ? transactionResult
      : Array.isArray(transactionResult?.data)
        ? transactionResult.data
        : Array.isArray(transactionResult?.transactions)
          ? transactionResult.transactions
        : [];
    if (!transactionsResponse.ok) {
      transactionError = transactionResult?.message || "Failed to load transaction history.";
    }
  } catch (error) {
    subscriptionError = error instanceof Error ? error.message : "Unable to load subscription data.";
  }

  // The backend response is the source of truth. Session values must not
  // resurrect an expired or cancelled Premium subscription.
  const subscriptionUser = {
    ...sessionUser,
    ...remoteSubscription,
  } as typeof sessionUser;
  const requestedPlan = String(subscriptionUser.subscriptionPlan || "Free");
  const requestedStatus = String(
    subscriptionUser.subscriptionStatus ||
      (requestedPlan.toLowerCase() === "premium" ? "active" : "inactive")
  ).toLowerCase();
  const isPremium =
    requestedPlan.toLowerCase() === "premium" &&
    (requestedStatus === "active" || requestedStatus === "trialing");
  const currentPlan = isPremium ? "Premium" : "Free";
  const subscriptionStatus = isPremium ? requestedStatus : "inactive";
  const formatDate = (value?: string | Date) => value ? new Date(value).toLocaleDateString() : "Not available";

  const freeFeatures = [
    "Up to 3 active services",
    "Basic vendor profile",
    "Booking management",
    "View customer booking requests",
    "Standard support",
  ];

  const premiumFeatures = [
    "Unlimited active services",
    "Premium vendor badge",
    "Better service visibility",
    "Full booking management",
    "Priority support",
    "All Free plan features",
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EF] px-4 py-8 text-[#302925] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#C98291]">
            <Crown size={18} />
            Vendor Subscription
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Choose Your <span className="text-[#C98291]">Plan</span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8B8179]">
            Manage your subscription and choose the right plan to grow
            your wedding service business with WedPlan.
          </p>
        </div>

        {subscriptionError && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {subscriptionError}
          </div>
        )}

        {/* Current Plan */}
        <div className="relative overflow-hidden rounded-2xl border border-[#EADDE0] bg-white p-5 shadow-[0_8px_30px_rgba(80,50,50,0.06)] sm:p-7">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#F9E9EC] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#F9E9EC] px-3 py-1 text-xs font-semibold text-[#B66E7E]">
                  CURRENT PLAN
                </span>

                <span className={`flex items-center gap-1 text-xs font-medium ${isPremium ? "text-green-600" : "text-gray-500"}`}>
                  <span className={`h-2 w-2 rounded-full ${isPremium ? "bg-green-500" : "bg-gray-400"}`} />
                  {subscriptionStatus}
                </span>
              </div>

              <h2 className="text-2xl font-bold">
                {currentPlan} Plan
              </h2>

              <p className="mt-1 text-sm text-[#8B8179]">
                {isPremium ? "Your Premium subscription is active." : "You are currently using the free WedPlan subscription."}
              </p>
              {isPremium && subscriptionUser.subscriptionCancelAtPeriodEnd ? (
                <p className="mt-4 text-xs font-semibold text-amber-700">
                  Cancellation scheduled. Premium access continues until {formatDate(subscriptionUser.subscriptionExpiresAt)}.
                </p>
              ) : isPremium ? <CancelButton /> : null}
            </div>

            <div className="rounded-xl border border-[#F0E5E7] bg-[#FFF8F8] px-5 py-4">
              <p className="text-xs font-medium text-[#8B8179]">
                Current Price
              </p>

              <p className="mt-1 text-2xl font-bold text-[#302925]">
                ৳0
                <span className="text-sm font-normal text-[#8B8179]">
                  {" "}/ month
                </span>
              </p>
            </div>
          </div>

          <div className="relative mt-6 grid gap-5 border-t border-[#F0E5E7] pt-5 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#F9E9EC] p-2 text-[#C98291]">
                <Zap size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold">Service Limit</p>
                <p className="text-xs text-[#8B8179]">
                  {isPremium ? "Unlimited active services" : "Up to 3 active services"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#F9E9EC] p-2 text-[#C98291]">
                <CalendarDays size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold">Billing</p>
                <p className="text-xs text-[#8B8179]">
                  {isPremium ? `Renews: ${formatDate(subscriptionUser.subscriptionExpiresAt)}` : "No payment required"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#F9E9EC] p-2 text-[#C98291]">
                <Clock size={19} />
              </div>
              <div>
                <p className="text-sm font-semibold">Cancellation status</p>
                <p className="text-xs text-[#8B8179]">
                  {subscriptionUser.subscriptionCancelAtPeriodEnd ? "Scheduled at period end" : "Not scheduled"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div>
          <div className="mb-5">
            <h2 className="text-xl font-bold">Available Plans</h2>
            <p className="mt-1 text-sm text-[#8B8179]">
              Choose a plan that works best for your business.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Free Plan */}
            <div className={`rounded-2xl border-2 p-6 shadow-[0_8px_30px_rgba(80,50,50,0.06)] sm:p-8 ${isPremium ? "border-[#EADDE0] bg-white" : "border-[#C98291] bg-[#FFF8F8]"}`}>
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9E9EC] text-[#C98291]">
                    <ShieldCheck size={25} />
                  </div>

                  <h3 className="text-xl font-bold">Free Plan</h3>

                  <p className="mt-1 text-sm text-[#8B8179]">
                    Perfect for getting started.
                  </p>
                </div>

                {!isPremium && <span className="rounded-full bg-[#C98291] px-3 py-1 text-xs font-bold text-white">CURRENT PLAN</span>}
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">৳0</span>
                <span className="text-sm text-[#8B8179]"> / month</span>
              </div>

              <div className="mb-7 space-y-4">
                {freeFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F9E9EC] text-[#C98291]">
                      <Check size={13} />
                    </div>

                    <span className="text-sm text-[#554A46]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-[#C98291]/30 bg-[#F9E9EC] py-3 text-sm font-bold text-[#B66E7E]"
              >
                {isPremium ? "Free Plan" : "Your Current Plan"}
              </button>
            </div>

            {/* Premium Plan */}
            <div className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-[0_8px_30px_rgba(80,50,50,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#C98291] hover:shadow-lg sm:p-8 ${isPremium ? "border-[#C98291] bg-[#FFF8F8]" : "border-[#EADDE0] bg-white"}`}>
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#F9E9EC] blur-3xl" />

              <div className="relative mb-6 flex items-start justify-between">
                <div>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C98291] text-white">
                    <Crown size={25} />
                  </div>

                  <h3 className="text-xl font-bold">Premium Plan</h3>

                  <p className="mt-1 text-sm text-[#8B8179]">
                    Grow your business without limits.
                  </p>
                </div>

                <span className="rounded-full border border-[#EADDE0] bg-[#FFF8F8] px-3 py-1 text-xs font-semibold text-[#B66E7E]">
                  <Sparkles size={12} className="mr-1 inline" />
                  {isPremium ? "CURRENT PLAN" : "PREMIUM"}
                </span>
              </div>

              <div className="relative mb-6">
                <span className="text-4xl font-bold">৳999</span>
                <span className="text-sm text-[#8B8179]"> / month</span>
              </div>

              <div className="relative mb-7 space-y-4">
                {premiumFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F9E9EC] text-[#C98291]">
                      <Check size={13} />
                    </div>

                    <span className="text-sm text-[#554A46]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {isPremium ? (
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3 text-sm font-bold text-green-700"
                >
                  Premium Active
                </button>
              ) : (
                <UpgradeButton />
              )}

              <p className="relative mt-3 text-center text-xs text-[#A69A94]">
                <CreditCard size={13} className="mr-1 inline" />
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Information */}
        <div className="rounded-2xl border border-[#EADDE0] bg-white p-5 shadow-[0_8px_30px_rgba(80,50,50,0.04)]">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#F9E9EC] p-2 text-[#C98291]">
              <Clock size={20} />
            </div>

            <div>
              <h3 className="text-sm font-bold">
                Subscription Information
              </h3>

              <p className="mt-1 text-xs leading-6 text-[#8B8179]">
                  {isPremium
                  ? `Premium is ${subscriptionStatus}. Started: ${formatDate(subscriptionUser.subscriptionStartedAt)}. Renewal/expiration: ${formatDate(subscriptionUser.subscriptionExpiresAt)}.${subscriptionUser.subscriptionCancelledAt ? ` Cancelled: ${formatDate(subscriptionUser.subscriptionCancelledAt)}.` : ""}${subscriptionUser.subscriptionCancelAtPeriodEnd ? " Cancellation is scheduled at period end; Premium remains active until expiry." : ""}`
                  : "Your Free plan remains active until you upgrade. Premium features will become available after successful payment verification. All subscription payments are securely processed through Stripe."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#EADDE0] bg-white p-5 shadow-[0_8px_30px_rgba(80,50,50,0.04)] sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold">Payment History</h3>
              <p className="mt-1 text-xs text-[#8B8179]">Your verified Premium subscription payments.</p>
            </div>
            <CreditCard size={20} className="text-[#C98291]" />
          </div>
          {transactionError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{transactionError}</p>
          )}
          {transactions.length ? (
            <div className="divide-y divide-[#F0E5E7]">
              {transactions.slice(0, 5).map((transaction, index) => (
                <div key={String(transaction._id || transaction.id || index)} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-[#302925]">Premium Subscription</p>
                    <p className="mt-1 text-xs text-[#8B8179]">
                      {formatDate(String(transaction.createdAt || transaction.paidAt || transaction.date || ""))}
                    </p>
                    <p className="mt-1 text-xs text-[#8B8179]">
                      Status: {String(transaction.status || "unknown")} · ID: {String(transaction.transactionId || transaction.invoiceId || transaction._id || transaction.id || "N/A")}
                    </p>
                    <p className="mt-1 text-xs text-[#8B8179]">
                      Subscription: {String(transaction.subscriptionId || "N/A")}
                    </p>
                  </div>
                  <span className="font-semibold text-[#302925]">
                    {String(transaction.currency || "BDT").toUpperCase()} {String(transaction.amount ?? transaction.total ?? "N/A")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-[#FDFBF9] px-4 py-5 text-center text-sm text-[#8B8179]">No payment history available.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default SubscriptionPage;
