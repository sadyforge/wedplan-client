
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  UserRound,
  Store,
  ShieldCheck,
  Heart,
  Mail,
  LockKeyhole,
  User,
  ArrowRight,
  Sparkles,
  ImagePlus,
  Eye,
  EyeOff,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ROLE_OPTIONS = [
  { value: "customer", label: "Customer", icon: UserRound },
  { value: "vendor", label: "Vendor", icon: Store },
  { value: "admin", label: "Admin", icon: ShieldCheck },
] as const;

type UserRole = (typeof ROLE_OPTIONS)[number]["value"];

const SignUp = () => {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("customer");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setPreviewURL("");
      return;
    }

    const objectURL = URL.createObjectURL(imageFile);
    setPreviewURL(objectURL);

    return () => URL.revokeObjectURL(objectURL);
  }, [imageFile]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImageURL("");
    setUploading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY;

      if (!apiKey) {
        throw new Error("ImgBB API key is missing");
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.error?.message || "Image upload failed");
      }

      setImageURL(result.data.url);
      toast.success("Profile picture uploaded successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      setImageFile(null);
      setImageURL("");
      toast.error(
        error instanceof Error ? error.message : "Image upload failed"
      );
      event.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImageURL("");

    const input = document.getElementById("image") as HTMLInputElement | null;

    if (input) input.value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (uploading) {
      toast.error("Please wait for the image upload to finish");
      return;
    }

    if (imageFile && !imageURL) {
      toast.error("Please upload your profile picture again");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password, 
        image: imageURL || undefined,
        role,
      });

      if (error) {
        toast.error(error.message || "Something went wrong");
        return;
      }

      toast.success("Account created successfully!");
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

const handleGoogleSignin = async () => {
  try {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
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
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#302925] p-12 text-[#F8F4EF] lg:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#C98291]/20 blur-3xl" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2">
              <Heart className="h-7 w-7 text-[#C98291]" />
              <span className="text-2xl font-bold tracking-wide">
                WedPlan
              </span>
            </Link>
          </div>

          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C98291]/15">
              <Sparkles className="h-7 w-7 text-[#C98291]" />
            </div>

            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Make Your Special Day Truly Unforgettable.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-[#D7C9C0]">
              Join WedPlan and discover everything you need to plan your
              perfect wedding. Connect with trusted vendors and create
              beautiful memories.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm text-[#D7C9C0]">
            <Heart className="h-4 w-4 text-[#C98291]" />
            Your dream wedding starts here.
          </div>
        </div>

        <div className="px-6 py-10 sm:px-10 lg:px-12">
          <div className="mb-8 text-center lg:text-left">
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2 lg:hidden"
            >
              <Heart className="h-6 w-6 text-[#C98291]" />
              <span className="text-xl font-bold text-[#302925]">
                WedPlan
              </span>
            </Link>

            <h2 className="text-3xl font-bold text-[#302925]">
              Create Account
            </h2>

            <p className="mt-2 text-sm text-[#897A72]">
              Join WedPlan and start planning your special day.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-3 block text-sm font-semibold text-[#302925]">
                Join WedPlan as
              </label>

              <div className="grid grid-cols-3 gap-3">
                {ROLE_OPTIONS.map((option) => {
                  const selected = role === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 text-center transition ${
                        selected
                          ? "border-[#C98291] bg-[#FCEEF1]"
                          : "border-[#EDE3DC] hover:border-[#C98291]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={selected}
                        onChange={() => setRole(option.value)}
                        className="sr-only"
                      />

                      <option.icon
                        className={`h-5 w-5 ${
                          selected ? "text-[#B66F7F]" : "text-[#897A72]"
                        }`}
                      />

                      <span
                        className={`text-xs font-semibold ${
                          selected ? "text-[#302925]" : "text-[#897A72]"
                        }`}
                      >
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[#302925]"
              >
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94774F]" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[#EDE3DC] bg-[#F8F4EF]/50 py-3 pl-12 pr-4 text-sm text-[#302925] outline-none transition focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#302925]"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94774F]" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[#EDE3DC] bg-[#F8F4EF]/50 py-3 pl-12 pr-4 text-sm text-[#302925] outline-none transition focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#302925]"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94774F]" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-[#EDE3DC] bg-[#F8F4EF]/50 py-3 pl-12 pr-12 text-sm text-[#302925] outline-none transition focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94774F]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-semibold text-[#302925]"
              >
                Profile Picture
              </label>

              <div className="relative">
                <ImagePlus className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94774F]" />

                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-[#EDE3DC] bg-[#F8F4EF]/50 py-3 pl-12 pr-3 text-sm text-[#302925] file:mr-3 file:rounded-lg file:border-0 file:bg-[#C98291] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
                />
              </div>

              {previewURL && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#EDE3DC] p-3">
                  <img
                    src={previewURL}
                    alt="Profile preview"
                    className="h-14 w-14 rounded-full object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#302925]">
                      {imageFile?.name}
                    </p>

                    <p className="text-xs text-[#897A72]">
                      {uploading ? "Uploading..." : "Image uploaded"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-sm font-medium text-red-500"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C98291] py-3.5 text-sm font-semibold text-white transition hover:bg-[#B66F7F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Creating Account..."
                : uploading
                  ? "Uploading Image..."
                  : "Create Account"}

              {!submitting && !uploading && (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </form>

{/* Google */}
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-[#EDE3DC]" />
  </div>

  <div className="relative flex justify-center text-sm">
    <span className="bg-white px-4 text-[#897A72]">
      Or continue with
    </span>
  </div>
</div>

<button
  type="button"
  onClick={handleGoogleSignin}
  className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#EDE3DC] bg-white py-3 text-sm font-semibold text-[#302925] transition hover:bg-[#F8F4EF]"
>
  <svg className="h-5 w-5" viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.09 13.22l7.98 6.19C13 13.72 18.09 9.5 24 9.5Z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.72 7.18l7.36 5.71c4.3-3.97 7.4-9.83 7.4-17.36Z"
    />
    <path
      fill="#FBBC05"
      d="M11.07 28.59A14.5 14.5 0 0 1 10.3 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 3.09 10.78l7.98-6.19Z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.47 0 11.9-2.13 15.87-5.79l-7.36-5.71c-2.05 1.38-4.67 2.2-8.51 2.2-5.91 0-11-4.22-12.93-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
    />
  </svg>

  Continue with Google
</button>


          <p className="mt-7 text-center text-sm text-[#897A72]">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#B66F7F] transition hover:text-[#302925]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
