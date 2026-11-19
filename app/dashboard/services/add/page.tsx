"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  ImagePlus,
  MapPin,
  Tag,
  DollarSign,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { AddServices } from "@/lib/actions/services";
import { useRouter } from "next/navigation";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const AddServiceForm = () => {
  const router=useRouter()
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  });

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!image) {
    toast.error("Please upload a service image.");
    return;
  }

  if (Number(formData.price) <= 0) {
    toast.error("Please enter a valid price.");
    return;
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY;

    if (!apiKey) {
      toast.error("Image API key is missing.");
      return;
    }

    const imageData = new FormData();
    imageData.append("image", image);

    const imageResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imageData,
      }
    );

    const imageResult = await imageResponse.json();

    if (!imageResponse.ok || !imageResult.success) {
      throw new Error("Image upload failed.");
    }

    const serviceData = {
      ...formData,
      price: Number(formData.price),
      image: imageResult.data.url,
    };

    const result = await AddServices(serviceData);

    if (result?.success) {
      toast.success("Service added successfully!");

      setFormData({
        serviceName: "",
        category: "",
        description: "",
        price: "",
        location: "",
      });

      setImage(null);
      setPreview("");
      router.push("/dashboard/services")
      
    } else {
      toast.error(result?.message || "Failed to submit service.");
    }
  } catch (error) {
    console.error("Add service error:", error);
    toast.error(
      error instanceof Error ? error.message : "Something went wrong."
    );
  }
};

  return (
    <div className="min-h-screen w-full min-w-0 flex-1 bg-[#F8F4EF] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full min-w-0 max-w-none">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/services"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#897A72] transition hover:text-[#C98291]"
          >
            <ArrowLeft size={17} />
            Back to My Services
          </Link>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C98291]">
                Vendor Dashboard
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-[#302925] sm:text-4xl">
                Add New Service
              </h1>

              <p className="mt-2 text-sm text-[#897A72]">
                Share your wedding service with couples planning their special
                day.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full min-w-0 rounded-2xl border border-[#EDE3DC] bg-[#e7dddd] p-5 shadow-sm sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div>
              <label
                htmlFor="serviceName"
                className="mb-2 block text-sm font-semibold text-[#302925]"
              >
                Service Name
              </label>

              <input
                id="serviceName"
                name="serviceName"
                type="text"
                required
                minLength={3}
                value={formData.serviceName}
                onChange={handleChange}
                placeholder="e.g. Premium Wedding Photography"
                className="w-full rounded-xl border border-[#EDE3DC] bg-[#FDFCFA] px-4 py-3 text-sm text-[#302925] outline-none transition placeholder:text-[#B5AAA2] focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/10"
              />
            </div>

            {/* Category & Price */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#302925]"
                >
                  <Tag size={15} className="text-[#C98291]" />
                  Service Category
                </label>

                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#EDE3DC] bg-[#FDFCFA] px-4 py-3 text-sm text-[#302925] outline-none transition focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/10"
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#302925]"
                >
                  <DollarSign size={15} className="text-[#C98291]" />
                  Price (BDT)
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 25000"
                  className="w-full rounded-xl border border-[#EDE3DC] bg-[#FDFCFA] px-4 py-3 text-sm text-[#302925] outline-none transition placeholder:text-[#B5AAA2] focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/10"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#302925]"
              >
                <MapPin size={15} className="text-[#C98291]" />
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Sylhet, Bangladesh"
                className="w-full rounded-xl border border-[#EDE3DC] bg-[#FDFCFA] px-4 py-3 text-sm text-[#302925] outline-none transition placeholder:text-[#B5AAA2] focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/10"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#302925]"
              >
                <FileText size={15} className="text-[#C98291]" />
                Description
              </label>

              <textarea
                id="description"
                name="description"
                required
                minLength={20}
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service, what you offer, and what makes it special..."
                className="w-full resize-none rounded-xl border border-[#EDE3DC] bg-[#FDFCFA] px-4 py-3 text-sm text-[#302925] outline-none transition placeholder:text-[#B5AAA2] focus:border-[#C98291] focus:ring-2 focus:ring-[#C98291]/10"
              />
            </div>

            {/* Service Image */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302925]">
                Service Image
              </label>

              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-[#EDE3DC]">
                  <img
                    src={preview}
                    alt="Service preview"
                    className="h-64 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#302925] shadow-md transition hover:bg-[#F8F4EF]"
                  >
                    <X size={18} />
                  </button>

                  <p className="bg-[#FDFCFA] px-4 py-3 text-xs text-[#897A72]">
                    {image?.name}
                  </p>
                </div>
              ) : (
                <label
                  htmlFor="serviceImage"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5D5CE] bg-[#FDFCFA] px-5 py-10 text-center transition hover:border-[#C98291] hover:bg-[#FCF7F6]"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F8EDEF] text-[#C98291]">
                    <ImagePlus size={23} />
                  </div>

                  <p className="text-sm font-semibold text-[#302925]">
                    Click to upload service image
                  </p>

                  <p className="mt-1 text-xs text-[#A89B93]">
                    PNG, JPG or WEBP · Maximum 5MB
                  </p>

                  <input
                    id="serviceImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Approval Notice */}
            <div className="rounded-xl border border-[#dbb29a] bg-[#FCF7F2] p-4">
              <p className="text-sm font-semibold text-[#302925]">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#C98291]" />
                Admin Approval Required
              </p>

              <p className="mt-1 text-xs leading-6 text-[#897A72]">
                Your service will be submitted with Pending status. It will
                become visible to customers after admin approval.
              </p>
            </div>

            {/* Submit */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#F0EAE5] pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/dashboard/services"
                className="rounded-xl border border-[#EDE3DC] px-6 py-3 text-center text-sm font-semibold text-[#6F625B] transition hover:bg-[#F8F4EF]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C98291] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#B66F7F]"
              >
                Submit Service
              </button>
            </div>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-[#A89B93]">
          Make sure your service information is accurate before submitting.
        </p>
      </div>
    </div>
  );
};

export default AddServiceForm;