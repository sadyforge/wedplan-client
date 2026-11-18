
"use client";

import Link from "next/link";
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
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SignUp = () => {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewImage("");
      return;
    }

    const imageUrl = URL.createObjectURL(selectedImage);
    setPreviewImage(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [selectedImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG and JPG images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const role = String(formData.get("role") || "customer");

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain an uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain a lowercase letter");
      return;
    }

    if (!["customer", "vendor", "admin"].includes(role)) {
      toast.error("Invalid account role");
      return;
    }

    if (role === "admin") {
      toast.error("Admin accounts can only be created by an administrator");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (selectedImage) {
        const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY;

        if (!apiKey) {
          toast.error("ImgBB API key is missing");
          return;
        }

        const imageFormData = new FormData();
        imageFormData.append("image", selectedImage);

        const uploadResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: imageFormData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          toast.error(uploadResult.error?.message || "Image upload failed");
          return;
        }

        imageUrl = uploadResult.data.url;
      }

      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: imageUrl || undefined,
        role,
      });

      if (error) {
        toast.error(error.message || "Registration failed!");
        return;
      }

      if (data) {
        toast.success("Successfully registered!");
        router.push("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
              Make Every Celebration
              <span className="text-[#D99BA8]"> Unforgettable.</span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              Discover trusted wedding vendors, explore beautiful services,
              and bring your dream celebration to life with WedPlan.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#302925] bg-[#E8CDA1] text-[#302925]">
                  <UserRound size={17} />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#302925] bg-[#C98291] text-white">
                  <Heart size={17} />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#302925] bg-[#94774F] text-white">
                  <Sparkles size={17} />
                </div>
              </div>
              <p className="text-xs text-white/60">
                Your celebration, your way.
              </p>
            </div>
          </div>

          <p className="relative z-10 text-xs text-white/40">
            © 2026 WedPlan. All rights reserved.
          </p>
        </div>

        <div className="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="text-2xl font-bold text-[#302925]">
              Wed<span className="text-[#C98291]">Plan</span>
            </Link>
          </div>

          <div className="mb-8">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F8F0EE] px-4 py-2 text-xs font-semibold text-[#B66F7F]">
              <Sparkles size={14} />
              Join Our Community
            </span>

            <h1 className="text-3xl font-bold text-[#302925]">
              Create Your Account
            </h1>

            <p className="mt-2 text-sm text-[#897A72]">
              Start planning something beautiful with WedPlan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-3 block text-sm font-semibold text-[#302925]">
                Choose Your Role
              </label>

              <div className="grid grid-cols-3 gap-3">
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-[#E8CDA1] bg-[#FBF6ED] px-2 py-4 text-center transition hover:border-[#C98291]">
                  <UserRound size={23} className="text-[#94774F]" />
                  <span className="text-xs font-semibold text-[#302925]">Customer</span>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    defaultChecked
                    className="accent-[#C98291]"
                  />
                </label>

                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-[#EDE3DC] bg-[#FDFBF9] px-2 py-4 text-center transition hover:border-[#C98291]">
                  <Store size={23} className="text-[#C98291]" />
                  <span className="text-xs font-semibold text-[#302925]">Vendor</span>
                  <input
                    type="radio"
                    name="role"
                    value="vendor"
                    className="accent-[#C98291]"
                  />
                </label>

                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-[#EDE3DC] bg-[#FDFBF9] px-2 py-4 text-center transition hover:border-[#C98291]">
                  <ShieldCheck size={23} className="text-[#94774F]" />
                  <span className="text-xs font-semibold text-[#302925]">Admin</span>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    className="accent-[#C98291]"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302925]">
                Profile Image
              </label>

              <label className="group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-[#E8CDA1] bg-[#FBF6ED] p-4 transition hover:border-[#C98291] hover:bg-[#FDF8F5]">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-[#C98291] shadow-sm transition group-hover:bg-[#C98291] group-hover:text-white">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus size={25} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#302925]">
                    {selectedImage
                      ? selectedImage.name
                      : "Upload your profile picture"}
                  </p>
                  <p className="mt-1 text-xs text-[#A89990]">
                    PNG, JPG or JPEG (Max. 5MB)
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#C98291] px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-[#B66F7F]">
                  Browse
                </span>

                <input
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>

              {selectedImage && (
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="mt-2 flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
                >
                  <X size={14} />
                  Remove image
                </button>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302925]">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B7A69B]" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[#EDE3DC] bg-[#FDFBF9] py-3.5 pl-11 pr-4 text-sm text-[#302925] outline-none transition placeholder:text-[#B7A69B] focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302925]">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B7A69B]" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[#EDE3DC] bg-[#FDFBF9] py-3.5 pl-11 pr-4 text-sm text-[#302925] outline-none transition placeholder:text-[#B7A69B] focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/10"
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
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-[#EDE3DC] bg-[#FDFBF9] py-3.5 pl-11 pr-4 text-sm text-[#302925] outline-none transition placeholder:text-[#B7A69B] focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C98291] py-3.5 text-sm font-semibold text-white shadow-md shadow-[#C98291]/20 transition hover:bg-[#B66F7F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={17} />}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#EDE3DC]" />
              <span className="px-4 text-xs font-medium text-[#A89990]">
                OR CONTINUE WITH
              </span>
              <div className="flex-grow border-t border-[#EDE3DC]" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[#EDE3DC] bg-white py-3.5 text-sm font-semibold text-[#302925] transition hover:border-[#C98291] hover:bg-[#FDF8F5]"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 4)" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.64 5.93c4.46-4.13 7.12-10.2 7.12-17.58Z" />
                <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.95 23.95 0 0 0 0 21.56l7.98-6.19Z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.78l-7.64-5.93c-2.12 1.42-4.83 2.26-8.27 2.26-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
              </svg>
              Continue with Google
            </button>

          </form>

          <p className="mt-7 text-center text-sm text-[#897A72]">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-bold text-[#C98291] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
