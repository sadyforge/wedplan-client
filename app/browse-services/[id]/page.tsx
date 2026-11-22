import { GetApprovedService } from "@/lib/actions/services";
import BookingForm from "./BookingForm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, CheckCircle2, Clock3, Mail, MapPin, Phone, ShieldCheck, Sparkles, Tag } from "lucide-react";

interface Props { params: Promise<{ id: string }> }

const ServiceDetailsContent = async ({ params }: Props) => {
  const { id } = await params;
  const rawService = await GetApprovedService(id);
  const service =
    rawService && typeof rawService === "object"
      ? rawService["0"]
        ? { ...rawService["0"], ...rawService }
        : rawService.data || rawService
      : null;
  if (!service || service.status !== "approved") notFound();

  const images = service.images?.length ? service.images : service.image ? [service.image] : [];
  const vendorName = service.vendorName || service.vendor?.name || "Service Provider";
  const vendorEmail = service.vendorEmail || service.vendor?.email;
  const vendorPhone = service.vendorPhone || service.vendor?.phone;

  return (
    <main className="min-h-screen bg-[#F8F4EF] text-[#292820]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link href="/browse-services" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#94774f] transition hover:text-[#292820]"><ArrowLeft size={18} /> Back to Browse Services</Link>

        <header className="mb-8 rounded-3xl border border-[#e8e1d7] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"><ShieldCheck size={14} /> Approved Service</span>{service.category && <span className="rounded-full bg-[#f7efe4] px-3 py-1.5 text-xs font-semibold text-[#94774f]">{service.category}</span>}</div>
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{service.serviceName}</h1>
              <p className="mt-4 flex items-center gap-2 text-sm text-gray-500"><MapPin size={17} className="text-[#94774f]" />{service.location || "Location not specified"}</p>
            </div>
            <div className="rounded-2xl bg-[#292820] px-6 py-5 text-white lg:min-w-56"><p className="text-sm text-white/60">Starting Price</p><p className="mt-1 text-3xl font-bold text-[#E8C88E]">৳{Number(service.price || 0).toLocaleString("en-BD")}</p><p className="mt-1 text-xs text-white/50">Contact vendor for details</p></div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section>{images.length ? <div className="grid gap-4 sm:grid-cols-2">{images.map((image: string, index: number) => <div key={index} className={`group relative overflow-hidden rounded-2xl border border-[#e8e1d7] bg-[#f2eadf] ${index === 0 ? "h-72 sm:col-span-2 sm:h-[430px]" : "h-56"}`}><Image src={image} alt={service.serviceName} fill priority={index === 0} unoptimized sizes="(max-width: 768px) 100vw, 66vw" className="object-cover transition duration-700 group-hover:scale-105" />{index === 0 && <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold text-[#94774f] shadow-sm"><Sparkles size={14} /> Featured Image</span>}</div>)}</div> : <div className="flex h-72 items-center justify-center rounded-2xl border border-[#e8e1d7] bg-white text-sm text-gray-400">No service image available</div>}</section>

            <section className="rounded-2xl border border-[#e8e1d7] bg-white p-6 shadow-sm md:p-8"><div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-[#f7efe4] p-3 text-[#94774f]"><Sparkles size={21} /></div><div><h2 className="text-xl font-bold">About This Service</h2><p className="mt-1 text-xs text-gray-400">Everything you need to know</p></div></div><p className="whitespace-pre-line text-sm leading-8 text-gray-600 md:text-base">{service.description || "No description available."}</p></section>

            <section className="rounded-2xl border border-[#e8e1d7] bg-white p-6 shadow-sm md:p-8"><h2 className="mb-7 text-xl font-bold">Service Information</h2><div className="grid gap-6 sm:grid-cols-2"><InfoItem icon={<Tag size={20} />} label="Category" value={service.category || "Not specified"} /><InfoItem icon={<MapPin size={20} />} label="Service Location" value={service.location || "Not specified"} /><InfoItem icon={<CheckCircle2 size={20} />} label="Service Status" value="Approved" green /><InfoItem icon={<Clock3 size={20} />} label="Availability" value="Contact Vendor" /></div></section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-[#e8e1d7] bg-white p-6 shadow-sm"><h2 className="mb-6 text-lg font-bold">Service Provider</h2><div className="mb-6 flex items-center gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f7efe4] text-2xl font-bold text-[#94774f]">{vendorName.charAt(0).toUpperCase()}</div><div className="min-w-0"><h3 className="truncate font-semibold">{vendorName}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-green-600"><ShieldCheck size={13} /> Approved Vendor</p></div></div><div className="space-y-4 border-t border-gray-100 pt-5">{vendorEmail && <div className="flex items-start gap-3 text-sm text-gray-500"><Mail size={18} className="mt-0.5 shrink-0 text-[#94774f]" /><span className="break-all">{vendorEmail}</span></div>}{vendorPhone && <div className="flex items-center gap-3 text-sm text-gray-500"><Phone size={18} className="shrink-0 text-[#94774f]" /><span>{vendorPhone}</span></div>}{!vendorEmail && !vendorPhone && <p className="text-sm text-gray-400">Vendor contact information is not available.</p>}</div></section>

            <BookingForm serviceId={String(service._id)} serviceName={service.serviceName} price={Number(service.price)} />
            <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-5 text-green-800"><ShieldCheck size={22} className="mt-0.5 shrink-0 text-green-600" /><div><h3 className="text-sm font-semibold">Admin Verified Service</h3><p className="mt-1 text-xs leading-6 text-green-700/70">This service has been reviewed and approved by the admin.</p></div></div>
          </aside>
        </div>
      </div>
    </main>
  );
};

function InfoItem({ icon, label, value, green = false }: { icon: ReactNode; label: string; value: string; green?: boolean }) { return <div className="flex items-center gap-4"><div className={`rounded-xl p-3 ${green ? "bg-green-50 text-green-600" : "bg-[#f7efe4] text-[#94774f]"}`}>{icon}</div><div><p className="text-xs text-gray-400">{label}</p><p className={`mt-1 font-semibold ${green ? "text-green-600" : "text-[#292820]"}`}>{value}</p></div></div>; }

const BrowseServiceDetailsPage = ({ params }: Props) => <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F8F4EF] text-[#94774f]"><p className="animate-pulse">Loading service details...</p></div>}><ServiceDetailsContent params={params} /></Suspense>;

export default BrowseServiceDetailsPage;
