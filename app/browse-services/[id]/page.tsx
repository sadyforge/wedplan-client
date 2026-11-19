
import { GetSingleService } from "@/lib/actions/services";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Tag,
  ShieldCheck,
  ArrowUpRight,
  Phone,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Service {
  _id: string;
  serviceName: string;
  category?: string;
  description?: string;
  price?: string | number;
  image?: string;
  location?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendorPhone?: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

const BrowseServicesCardDetailContent = async ({ params }: Props) => {
  const { id } = await params;

  const data = await GetSingleService(id);

  if (!data || data.success === false || !data.data?._id) {
    notFound();
  }

  const service: Service = data.data;

  return (
    <section className="min-h-screen bg-[#F8F4EF] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/browse-services"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#94774f] transition hover:text-[#292820]"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="relative h-[300px] overflow-hidden rounded-3xl bg-[#e8e1d7] sm:h-[450px]">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.serviceName}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}

              {service.category && (
                <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#94774f] shadow">
                  {service.category}
                </span>
              )}
            </div>

            <div className="rounded-3xl border border-[#e8e1d7] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#94774f]">
                    Wedding Service
                  </p>

                  <h1 className="mt-2 text-2xl font-bold text-[#292820] sm:text-3xl">
                    {service.serviceName}
                  </h1>
                </div>

                <div className="rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} />
                    Available Service
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 border-y border-gray-100 py-5 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#f5efe7] p-3 text-[#94774f]">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="mt-1 text-sm font-semibold text-[#292820]">
                      {service.location || "Location not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#f5efe7] p-3 text-[#94774f]">
                    <Tag size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Category</p>
                    <p className="mt-1 text-sm font-semibold text-[#292820]">
                      {service.category || "General"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold text-[#292820]">
                  About This Service
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-gray-600">
                  {service.description || "No description available."}
                </p>
              </div>

              <div className="mt-8 rounded-2xl bg-[#faf8f5] p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-[#94774f]" size={22} />

                  <div>
                    <h3 className="font-semibold text-[#292820]">
                      Trusted Wedding Service
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      This service is available through WedPlan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-[#e8e1d7] bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-sm font-medium text-gray-500">
              Service Pricing
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#94774f]">
              {service.price ? `৳${service.price}` : "Contact for price"}
            </h2>

            <p className="mt-2 text-xs text-gray-400">
              Final pricing may depend on your requirements.
            </p>

            <div className="my-6 border-t border-gray-100" />

            <h3 className="font-bold text-[#292820]">
              Service Provider
            </h3>

            <div className="mt-4 rounded-2xl bg-[#faf8f5] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8cda1] text-[#292820]">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <p className="font-semibold text-[#292820]">
                    {service.vendorName || "WedPlan Service Provider"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Service Provider
                  </p>
                </div>
              </div>

              {service.vendorEmail && (
                <p className="mt-4 break-all text-xs text-gray-500">
                  {service.vendorEmail}
                </p>
              )}

              {service.vendorPhone && (
                <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={14} />
                  {service.vendorPhone}
                </p>
              )}
            </div>

            <Link
              href={`/dashboard/customer/book-service/${service._id}`}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#292820] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#94774f]"
            >
              Book This Service
              <ArrowUpRight size={18} />
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
              Make your special day memorable with the right service.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};

const BrowseServicesCardDetail = ({ params }: Props) => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-[#94774f]" />
            <p className="text-sm font-medium text-[#94774f]">
              Loading service...
            </p>
          </div>
        </div>
      }
    >
      <BrowseServicesCardDetailContent params={params} />
    </Suspense>
  );
};

export default BrowseServicesCardDetail;
