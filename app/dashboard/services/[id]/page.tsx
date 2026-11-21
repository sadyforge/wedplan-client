
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { authFetch } from "@/lib/core/server";
import {
  ArrowLeft,
  MapPin,
  Tag,
  Pencil,
  ShieldCheck,
  UserRound,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import EditServiceDialog from "@/app/components/dashboard/EditServiceDialog";

const ServicesDetailContent = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  let service = null;

  try {
    const res = await authFetch(`${baseUrl}/services/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const result = await res.json();
      // The authenticated service endpoint returns the service document
      // directly; keep accepting the wrapped shape for API compatibility.
      service = result.data || result;
    }
  } catch (error) {
    console.error("Service fetch error:", error);
  }

  if (!service) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#F8F4EF] px-5">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#302925]">
            Service Not Found
          </h2>

          <p className="mt-3 text-[#81766F]">
            This service may have been removed or is unavailable.
          </p>

          <Link
            href="/dashboard/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C98291] px-7 py-3 text-white transition hover:bg-[#B66E7E]"
          >
            <ArrowLeft size={17} />
            Back to My Services
          </Link>
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EF] pb-20">
      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#76685F] transition hover:text-[#C98291]"
          >
            <ArrowLeft size={17} />
            Back to My Services
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Service Information */}
          <div>
            <div className="relative h-[320px] overflow-hidden rounded-3xl bg-[#E9DFD5] sm:h-[480px]">
              {service.image && (
                <Image
                  src={service.image}
                  alt={service.serviceName}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              )}
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#F0DCE0] px-4 py-2 text-xs font-semibold text-[#A65E70]">
                  {service.category}
                </span>

                {service.status === "approved" && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                    <CheckCircle2 size={15} />
                    Approved
                  </span>
                )}

                {service.status === "pending" && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                    <Clock size={15} />
                    Pending Approval
                  </span>
                )}

                {service.status === "rejected" && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-red-700">
                    <XCircle size={15} />
                    Rejected
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-semibold leading-tight text-[#302925] sm:text-4xl">
                {service.serviceName}
              </h1>

              <div className="mt-5 flex flex-wrap gap-5 text-sm text-[#81766F]">
                <span className="flex items-center gap-2">
                  <MapPin size={17} className="text-[#C98291]" />
                  {service.location}
                </span>

                <span className="flex items-center gap-2">
                  <Tag size={17} className="text-[#C98291]" />
                  {service.category}
                </span>
              </div>

              <div className="my-8 border-t border-[#E7DDD3]" />

              <h2 className="text-xl font-semibold text-[#302925]">
                About This Service
              </h2>

              <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-[#766D66]">
                {service.description}
              </p>
            </div>
          </div>

          {/* Service Details Card */}
          <aside>
            <div className="sticky top-8 rounded-3xl border border-[#EAE0D7] bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-medium text-[#897C73]">
                Service Price
              </p>

              <span className="mt-2 block text-3xl font-bold text-[#302925]">
                ৳{Number(service.price).toLocaleString("en-BD")}
              </span>

              <div className="my-7 border-t border-[#EEE5DD]" />

              <h3 className="text-lg font-semibold text-[#302925]">
                Service Information
              </h3>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E5E7] text-[#C98291]">
                  <UserRound size={23} />
                </div>

                <div>
                  <p className="font-semibold text-[#302925]">
                    {service.vendorName || "Service Vendor"}
                  </p>

                  <p className="mt-1 text-xs text-[#96877D]">
                    Service Provider
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <div className="flex items-center gap-3 text-sm text-[#766D66]">
                  <MapPin size={18} className="text-[#C98291]" />
                  <div>
                    <p className="text-xs text-[#A0968E]">Location</p>
                    <p className="mt-1 font-medium text-[#302925]">
                      {service.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-[#766D66]">
                  <Tag size={18} className="text-[#C98291]" />
                  <div>
                    <p className="text-xs text-[#A0968E]">Category</p>
                    <p className="mt-1 font-medium text-[#302925]">
                      {service.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-[#766D66]">
                  <ShieldCheck size={18} className="text-[#C98291]" />
                  <div>
                    <p className="text-xs text-[#A0968E]">Availability</p>
                    <p className="mt-1 font-medium text-[#302925]">
                      {service.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-7 border-t border-[#EEE5DD]" />

              <EditServiceDialog service={service}>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C98291] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#B66E7E]"
                >
                  <Pencil size={17} />
                  Edit This Service
                </button>
              </EditServiceDialog>

              <p className="mt-4 text-center text-xs leading-6 text-[#A0968E]">
                Manage and update your wedding service information.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

const ServicesDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-[#F8F4EF] text-[#81766F]">
          Loading service details...
        </div>
      }
    >
      <ServicesDetailContent params={params} />
    </Suspense>
  );
};

export default ServicesDetailPage;
