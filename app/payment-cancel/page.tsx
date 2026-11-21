import Link from "next/link";
import { CircleX } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F4EF] px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-[#EADDE0] bg-white p-8 text-center shadow-[0_8px_30px_rgba(80,50,50,0.06)]">
        <CircleX className="mx-auto text-[#C98291]" size={56} />
        <h1 className="mt-5 text-2xl font-bold text-[#302925]">Payment cancelled</h1>
        <p className="mt-3 text-sm leading-6 text-[#8B8179]">Your payment was cancelled and your current subscription has not been changed.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard/vendor/subscription" className="rounded-xl bg-[#C98291] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B66E7E]">Try Premium again</Link>
          <Link href="/dashboard" className="rounded-xl border border-[#EADDE0] px-5 py-3 text-sm font-bold text-[#302925] transition hover:bg-[#FFF8F8]">Back to dashboard</Link>
        </div>
      </section>
    </main>
  );
}
