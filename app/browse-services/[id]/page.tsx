
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  ShieldCheck,
  CalendarDays,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { GetSingleBrowseService } from "@/lib/actions/browse";

const BrowseCardDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const [id, setId] = useState("");
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        const data = await GetSingleBrowseService(id);
        setService(data);
      } catch (error) {
        console.error("Failed to fetch service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // নিচে তোমার আগের return এবং সম্পূর্ণ design রাখবে।


  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F4EF]">
        <p className="text-[#C98291]">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F8F4EF] px-5">
        <h2 className="text-2xl font-semibold text-[#302925]">
          Service Not Found
        </h2>
        <Link
          href="/browse-service"
          className="mt-5 rounded-full bg-[#C98291] px-6 py-3 text-white"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EF] px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/browse-services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#786C65] transition hover:text-[#C98291]"
        >
          <ArrowLeft size={17} />
          Back to Browse Services
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="relative h-[300px] overflow-hidden rounded-3xl sm:h-[450px]">
              {service.image && (
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover"
                />
              )}
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#F1DDE0] px-4 py-2 text-xs font-semibold text-[#B66F7F]">
                  {service.category}
                </span>

                {service.status === "approved" && (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">
                    <ShieldCheck size={14} />
                    Verified Service
                  </span>
                )}
              </div>

              <h1 className="mt-5 font-serif text-3xl font-semibold text-[#302925] sm:text-4xl">
                {service.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-[#786C65]">
                <span className="flex items-center gap-2">
                  <MapPin size={17} className="text-[#C98291]" />
                  {service.location}
                </span>

                {service.rating && (
                  <span className="flex items-center gap-2">
                    <Star size={17} className="fill-[#E5AD52] text-[#E5AD52]" />
                    {service.rating}
                    {service.totalReviews
                      ? ` (${service.totalReviews} reviews)`
                      : ""}
                  </span>
                )}
              </div>

              <div className="mt-9 border-t border-[#E9DED5] pt-8">
                <h2 className="font-serif text-2xl font-semibold text-[#302925]">
                  About This Service
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-[#786C65]">
                  {service.description || "No description available."}
                </p>
              </div>

              <div className="mt-9 border-t border-[#E9DED5] pt-8">
                <h2 className="font-serif text-2xl font-semibold text-[#302925]">
                  Why Choose This Service?
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-[#665B55]">
                    <CheckCircle2 size={19} className="text-[#C98291]" />
                    Professional wedding service
                  </div>

                  <div className="flex items-center gap-3 text-sm text-[#665B55]">
                    <CheckCircle2 size={19} className="text-[#C98291]" />
                    Easy booking process
                  </div>

                  <div className="flex items-center gap-3 text-sm text-[#665B55]">
                    <CheckCircle2 size={19} className="text-[#C98291]" />
                    Dedicated vendor support
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-24 rounded-3xl border border-[#EEE3DC] bg-white p-7 shadow-sm">
              <p className="text-sm font-medium text-[#786C65]">
                Starting Price
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#C98291]">
                ৳{Number(service.price || 0).toLocaleString("en-BD")}
              </h2>

              {service.priceType && (
                <p className="mt-1 text-sm text-[#786C65]">
                  {service.priceType}
                </p>
              )}

              <div className="my-7 border-t border-[#F0E8E2]" />

              <h3 className="text-lg font-semibold text-[#302925]">
                Vendor Information
              </h3>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1DDE0] font-serif text-xl text-[#B66F7F]">
                  {service.vendorName?.charAt(0) || "V"}
                </div>

                <div>
                  <p className="font-semibold text-[#302925]">
                    {service.vendorName || "Wedding Vendor"}
                  </p>
                  <p className="text-xs text-[#786C65]">
                    Professional Vendor
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C98291] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#B66F7F]"
                >
                  <CalendarDays size={18} />
                  Book This Service
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#C98291] px-6 py-4 text-sm font-semibold text-[#B66F7F] transition hover:bg-[#FDF1F3]"
                >
                  <MessageCircle size={18} />
                  Contact Vendor
                </button>
              </div>

              <p className="mt-5 text-center text-xs leading-6 text-[#94867E]">
                Final pricing and availability may vary depending on your
                wedding requirements.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default BrowseCardDetailPage;
