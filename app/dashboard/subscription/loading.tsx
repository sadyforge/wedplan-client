export default function SubscriptionLoading() {
  return (
    <div className="min-h-screen bg-[#F8F4EF] px-4 py-8 text-[#302925] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8" aria-busy="true">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-[#EADDE0]" />
        <div className="h-40 animate-pulse rounded-2xl bg-white shadow-[0_8px_30px_rgba(80,50,50,0.06)]" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-white" />
          <div className="h-96 animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    </div>
  );
}
