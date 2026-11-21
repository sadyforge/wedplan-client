const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const CreateCheckoutSession = async () => {
  try {
    const res = await fetch(`${baseUrl}/payments/create-checkout-session`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Failed to create checkout session.");
    if (typeof result.url !== "string" || !result.url) throw new Error("Checkout URL not found.");
    window.location.href = result.url;
    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to create checkout session.");
  }
};

export const VerifyCheckoutSession = async (sessionId: string) => {
  try {
    const res = await fetch(`${baseUrl}/payments/checkout-verify`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok && res.status !== 202) {
      throw new Error(result.message || "Payment verification failed.");
    }
    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Payment verification failed.");
  }
};

export const GetTransactions = async (cookie?: string) => {
  try {
    const res = await fetch(`${baseUrl}/payments/transactions`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: cookie ? { cookie } : undefined,
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Failed to fetch transactions.");
    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch transactions.");
  }
};

export const CancelSubscription = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const res = await fetch(`${baseUrl}/payments/cancel-subscription`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.message || "Failed to cancel subscription.");
  return result;
};
