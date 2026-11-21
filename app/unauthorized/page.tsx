'use client'
import Link from "next/link";
import { ShieldX, Home, ArrowLeft, LockKeyhole } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F6FF] px-4 py-12">
      {/* Background Decorations */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#EDE7FF] blur-3xl" />
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#EDE7FF] blur-3xl" />
      <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[#EDE7FF] blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        {/* Illustration */}
        <div className="relative mx-auto mb-8 flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
          <div className="absolute inset-5 rounded-full bg-[#EAE4FF]" />

          <div className="relative flex h-44 w-44 items-center justify-center rounded-[3rem] bg-gradient-to-br from-[#7665E8] to-[#4936B5] shadow-2xl shadow-purple-300/50 sm:h-56 sm:w-56">
            <ShieldX
              size={130}
              strokeWidth={1.4}
              className="text-white sm:h-40 sm:w-40"
            />

            <div className="absolute -right-5 -top-5 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-[#F8F6FF] bg-white text-[#5844C7] shadow-lg">
              <LockKeyhole size={30} />
            </div>
          </div>

          <div className="absolute -bottom-1 left-2 h-5 w-5 rounded-full bg-[#A99AFB]" />
          <div className="absolute right-0 top-8 h-4 w-4 rounded-full bg-[#C4B9FF]" />
        </div>

        {/* Content */}
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#DDD5FF] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#6653CF] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#7665E8]" />
            Error 403
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight text-[#17152D] sm:text-6xl">
            Unauthorized
          </h1>

          <p className="mx-auto max-w-xl text-base leading-7 text-[#69647D] sm:text-lg">
            You do not have permission to view this page. Please check your
            account permissions or return to the homepage.
          </p>

          {/* Actions */}
          <div className="flex flex-col items-center justify-center gap-3 pt-5 sm:flex-row">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6653CF] to-[#4936B5] px-7 py-4 font-semibold text-white shadow-lg shadow-purple-300/40 transition hover:-translate-y-1 hover:shadow-xl sm:w-auto"
            >
              <Home size={19} />
              Go Back Home
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#DED8F1] bg-white px-7 py-4 font-semibold text-[#514A70] transition hover:border-[#7665E8] hover:text-[#6653CF] sm:w-auto"
            >
              <ArrowLeft size={19} />
              Go Back
            </button>
          </div>
        </div>

        <p className="mt-14 text-sm text-[#A09AAF]">
          WedPlan · Secure Access
        </p>
      </div>
    </main>
  );
}