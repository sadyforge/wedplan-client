
"use client";

import Link from "next/link";
import {
  Heart,
  Mail,
  LockKeyhole,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SignInForm = () => {
const router=useRouter()
const searchParams=useSearchParams()

// Where to go after signing in. The route guard (proxy.ts) appends
// ?callbackURL=/dashboard/... when an unauthenticated user hits a private page.
const callbackURL=searchParams.get("callbackURL")||searchParams.get("redirect")||"/"

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const signInData = Object.fromEntries(formData.entries());

  const { data, error } = await authClient.signIn.email({
    email: String(signInData.email),
    password: String(signInData.password),
  });

  if (error) {
    toast.error(error.message || "Sign in failed!");
    return;
  }

  if (data) {
    await fetch("/api/auth/backend-token", { method: "POST" });
    toast.success("Successfully signed in!");

    if (searchParams.get("callbackURL") || searchParams.get("redirect")) {
      router.push(callbackURL);
    } else {
      // No explicit destination: send each user to their own dashboard.
      const session = await authClient.getSession();
      const role = String(
        (session?.data?.user as { role?: string } | null | undefined)?.role ||
          "customer"
      );
      router.push(
        role === "admin"
          ? "/dashboard/admin"
          : role === "vendor"
            ? "/dashboard/vendor"
            : "/dashboard/customer"
      );
    }
    router.refresh();
  }
};
  
const handleGoogleSignin = async () => {
  try {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });

    if (error) {
      toast.error(error.message || "Google sign in failed");
    }
  } catch (error) {
    console.error("Google sign in error:", error);
    toast.error("Something went wrong. Please try again.");
  }
};


  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F8F4EF] px-4 py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[#EDE3DC] bg-white shadow-xl lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#302925] p-12 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-white/10" />

          <Link href="/" className="relative z-10 text-3xl font-bold tracking-tight">
            Wed<span className="text-[#C98291]">Plan</span>
          </Link>

          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C98291]/20 text-[#E9AAB6]">
              <Heart size={28} />
            </div>

            <h2 className="max-w-md text-4xl font-bold leading-tight">
              Welcome Back to Your
              <span className="text-[#D99BA8]"> Dream Celebration.</span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              Your perfect celebration is just around the corner.
              Sign in and continue creating beautiful memories with WedPlan.
            </p>

            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70">
              <Sparkles size={16} className="text-[#D99BA8]" />
              Every beautiful story starts here.
            </div>
          </div>

          <p className="relative z-10 text-xs text-white/40">
            © 2026 WedPlan. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-14">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="text-2xl font-bold text-[#302925]">
              Wed<span className="text-[#C98291]">Plan</span>
            </Link>
          </div>

          <div className="mb-10">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F8F0EE] px-4 py-2 text-xs font-semibold text-[#B66F7F]">
              <Heart size={14} />
              Welcome Back
            </span>

            <h1 className="text-3xl font-bold text-[#302925] sm:text-4xl">
              Sign In to WedPlan
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#897A72]">
              We're happy to see you again. Enter your details to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302925]">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B7A69B]" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[#EDE3DC] bg-[#FDFBF9] py-4 pl-11 pr-4 text-sm text-[#302925] outline-none transition placeholder:text-[#B7A69B] focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302925]">
                Password
              </label>
              <div className="relative">
                <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B7A69B]" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#EDE3DC] bg-[#FDFBF9] py-4 pl-11 pr-4 text-sm text-[#302925] outline-none transition placeholder:text-[#B7A69B] focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C98291] py-4 text-sm font-semibold text-white shadow-md shadow-[#C98291]/20 transition hover:bg-[#B66F7F]"
            >
              Sign In
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#EDE3DC]" />
            <span className="text-xs font-medium text-[#B7A69B]">OR</span>
            <div className="h-px flex-1 bg-[#EDE3DC]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignin}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-[#EDE3DC] bg-white py-4 text-sm font-semibold text-[#302925] transition hover:bg-[#FDFBF9]"
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.42 37.92 46.98 31.75 46.98 24.55Z" />
              <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-9 text-center text-sm text-[#897A72]">
            Don't have an account?{" "}
            <Link href="/sign-up" className="font-bold text-[#C98291] hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

const SignIn = () => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4EF]">
        <p className="animate-pulse text-sm text-[#897A72]">Loading...</p>
      </div>
    }
  >
    <SignInForm />
  </Suspense>
);

export default SignIn;
