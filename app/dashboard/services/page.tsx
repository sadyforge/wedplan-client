
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import {
  Plus,
  MapPin,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  Clock,
  XCircle,
  Pencil,
  Eye,
  Sparkles,
  Crown,
} from "lucide-react";
import { requireDashboardRole } from "@/lib/dashboard-auth";
import { GetServices } from "@/lib/actions/services";
import EditServiceDialog from "@/app/components/dashboard/EditServiceDialog";
import DeleteServiceDialog from "@/app/components/dashboard/DeleteServiceDialog";

export const instant = false;

export default async function ServicesPage() {
  const user = await requireDashboardRole(["vendor", "admin"]);

  const requestHeaders = await headers();
  const services = await GetServices(requestHeaders.get("cookie") || undefined);
  const serviceList = Array.isArray(services) ? services : [];

  const totalServices = serviceList.length;

  const activeServices = serviceList.filter(
    (service) => service.isActive === true && service.status === "approved"
  ).length;

  const pendingServices = serviceList.filter(
    (service) => service.status === "pending"
  ).length;

  const rejectedServices = serviceList.filter(
    (service) => service.status === "rejected"
  ).length;

  const isAdmin = user?.role === "admin";

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-100";
      case "rejected":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F4EF] px-4 py-8 text-[#302925] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#C98291]">
              <Sparkles size={16} />
              {isAdmin ? "Admin Dashboard" : "Vendor Dashboard"}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {isAdmin ? "Manage Services" : "My Services"}
            </h1>

            <p className="mt-2 text-sm text-[#8B8179] sm:text-base">
              {isAdmin
                ? "Review and manage wedding services across the platform."
                : "Manage your wedding services, track approvals and grow your business."}
            </p>
          </div>

          {!isAdmin && (
            <Link
              href="/dashboard/services/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C98291] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B86F80]"
            >
              <Plus size={18} />
              Add New Service
            </Link>
          )}
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#EDE3DA] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B8179]">Total Services</p>
                <h2 className="mt-2 text-3xl font-semibold">
                  {totalServices}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9E9EC] text-[#C98291]">
                <BriefcaseBusiness size={22} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#A49A92]">
              All submitted services
            </p>
          </div>

          <div className="rounded-2xl border border-[#EDE3DA] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B8179]">Active Services</p>
                <h2 className="mt-2 text-3xl font-semibold">
                  {activeServices}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle2 size={22} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#A49A92]">
              Approved and available
            </p>
          </div>

          <div className="rounded-2xl border border-[#EDE3DA] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B8179]">Pending Review</p>
                <h2 className="mt-2 text-3xl font-semibold">
                  {pendingServices}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock size={22} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#A49A92]">
              Waiting for admin approval
            </p>
          </div>

          <div className="rounded-2xl border border-[#EDE3DA] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B8179]">Rejected Services</p>
                <h2 className="mt-2 text-3xl font-semibold">
                  {rejectedServices}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <XCircle size={22} />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#A49A92]">
              Services not approved
            </p>
          </div>
        </div>

        {/* Subscription Notice */}
        {!isAdmin && (
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E8D7BD] bg-[#F5EDE2] p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#B18B55]">
                <Crown size={21} />
              </div>

              <div>
                <h3 className="font-semibold">
                  Grow Your Wedding Business
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#8B8179]">
                  Free plan allows up to 3 active services. Upgrade to Premium
                  to publish unlimited services.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/vendor/subscription"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#302925] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#51443D]"
            >
              Explore Premium
              <span className="ml-2">↗</span>
            </Link>
          </div>
        )}

        {/* Services List */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">All Services</h2>

              <p className="mt-1 text-sm text-[#8B8179]">
                {isAdmin
                  ? "Review submitted services and their approval status."
                  : "View and manage all your submitted wedding services."}
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#F2E4E5] px-3 py-1.5 text-xs font-semibold text-[#B87583]">
              {totalServices} Services
            </span>
          </div>

          {totalServices > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {serviceList.map((service: any) => (
                <div
                  key={service._id || service.id}
                  className="group overflow-hidden rounded-2xl border border-[#EDE3DA] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#302925]/5"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-[#F1EAE3]">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={service.serviceName}
                        fill
                        unoptimized
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#C98291]">
                        <Camera size={40} />
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-[#B87583] shadow-sm">
                      {service.category}
                    </span>

                    <span
                      className={`absolute right-4 top-4 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                        service.status
                      )}`}
                    >
                      {service.status || "Pending"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-lg font-semibold transition group-hover:text-[#C98291]">
                        {service.serviceName}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#8B8179]">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#8B8179]">
                      <MapPin size={16} className="shrink-0 text-[#C98291]" />
                      <span className="line-clamp-1">
                        {service.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#F0EAE4] pt-4">
                      <div>
                        <p className="text-xs text-[#A49A92]">
                          Starting Price
                        </p>

                        <p className="mt-1 text-xl font-semibold text-[#C98291]">
                          ৳{Number(service.price).toLocaleString("en-BD")}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          service.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-t border-[#F0EAE4] pt-4">
                      <Link
                        href={`/dashboard/services/${service._id || service.id}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F9E9EC] px-3 py-2.5 text-sm font-semibold text-[#B87583] transition hover:bg-[#C98291] hover:text-white"
                      >
                        <Eye size={16} />
                        View
                      </Link>

                      {!isAdmin && (
                        <>
                          <EditServiceDialog service={service}>
                            <button
                              type="button"
                              title="Edit service"
                              aria-label="Edit service"
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EDE3DA] text-[#8B8179] transition hover:border-[#C98291] hover:text-[#C98291]"
                            >
                              <Pencil size={16} />
                            </button>
                          </EditServiceDialog>

                          <DeleteServiceDialog
                            serviceId={service._id || service.id}
                            serviceName={service.serviceName}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#DCCFC3] bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F9E9EC] text-[#C98291]">
                <BriefcaseBusiness size={28} />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                No Services Added Yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8B8179]">
                Start showcasing your wedding services. Add your first service
                and let couples discover your business.
              </p>

              {!isAdmin && (
                <Link
                  href="/dashboard/services/add"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C98291] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B86F80]"
                >
                  <Plus size={18} />
                  Add Your First Service
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
