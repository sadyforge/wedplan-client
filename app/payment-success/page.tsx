import PaymentSuccessContent from "./PaymentSuccessContent";

// Payment verification depends on the request URL's Stripe session_id.
// Render this route at request time instead of requiring an instant shell.
export const instant = false;

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return <PaymentSuccessContent searchParams={searchParams} />;
}
