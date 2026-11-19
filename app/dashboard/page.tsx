
// import Link from "next/link";
// import Image from "next/image";
// import {
//   Plus,
//   MapPin,
//   ArrowUpRight,
//   BriefcaseBusiness,
//   CheckCircle2,
//   Clock,
//   XCircle,
//   CalendarDays,
//   Crown,
//   Users,
//   ClipboardList,
//   ArrowRight,
// } from "lucide-react";
// import { requireDashboardRole } from "@/lib/dashboard-auth";
// import { GetServices } from "@/lib/actions/services";

// const baseUrl =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// const getBookings = async (vendorId: string) => {
//   try {
//     const res = await fetch(`${baseUrl}/bookings/vendor/${vendorId}`, {
//       cache: "no-store",
//     });

//     if (!res.ok) return [];

//     const result = await res.json();

//     return Array.isArray(result)
//       ? result
//       : result.data || [];
//   } catch {
//     return [];
//   }
// };

// const VendorDashboard = async () => {
//   const { user } = await requireDashboardRole(["vendor"]);

//   const [services, bookings] = await Promise.all([
//     GetServices(),
//     getBookings(user.id),
//   ]);

//   const serviceList = Array.isArray(services)
//     ? services
//     : services?.data || [];

//   const myServices = serviceList.filter(
//     (service: any) =>
//       String(service.vendorId) === String(user.id)
//   );

//   const totalServices = myServices.length;

//   const activeServices = myServices.filter(
//     (service: any) =>
//       service.status === "approved" && service.isActive !== false
//   ).length;

//   const pendingServices = myServices.filter(
//     (service: any) => service.status === "pending"
//   ).length;

//   const rejectedServices = myServices.filter(
//     (service: any) => service.status === "rejected"
//   ).length;

//   const pendingBookings = bookings.filter(
//     (booking: any) => booking.status === "pending"
//   ).length;

//   const acceptedBookings = bookings.filter(
//     (booking: any) => booking.status === "accepted"
//   ).length;

//   const subscriptionPlan = user.subscriptionPlan || "free";
//   const isPremium = subscriptionPlan === "premium";

//   const recentBookings = [...bookings]
//     .sort(
//       (a: any, b: any) =>
//         new Date(b.createdAt).getTime() -
//         new Date(a.createdAt).getTime()
//     )
//     .slice(0, 5);

//   const recentServices = [...myServices]
//     .sort(
//       (a: any, b: any) =>
//         new Date(b.createdAt).getTime() -
//         new Date(a.createdAt).getTime()
//     )
//     .slice(0, 5);

//   const stats = [
//     {
//       title: "Total Services",
//       value: totalServices,
//       description: "All submitted services",
//       icon: BriefcaseBusiness,
//       color: "bg-[#F9E9EC] text-[#C98291]",
//     },
//     {
//       title: "Active Services",
//       value: activeServices,
//       description: "Approved and available",
//       icon: CheckCircle2,
//       color: "bg-green-50 text-green-600",
//     },
//     {
//       title: "Pending Requests",
//       value: pendingBookings,
//       description: "Waiting for your response",
//       icon: Clock,
//       color: "bg-amber-50 text-amber-600",
//     },
//     {
//       title: "Accepted Bookings",
//       value: acceptedBookings,
//       description: "Confirmed bookings",
//       icon: CalendarDays,
//       color: "bg-blue-50 text-blue-600",
//     },
//   ];

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case "approved":
//       case "accepted":
//         return "bg-green-50 text-green-700";

//       case "pending":
//         return "bg-amber-50 text-amber-700";

//       case "rejected":
//         return "bg-red-50 text-red-600";

//       case "cancelled":
//         return "bg-gray-100 text-gray-600";

//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8F4EF] px-4 py-8 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl space-y-8">

//         {/* Header */}
//         <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
//           <div>
//             <p className="mb-2 flex items-center gap-2 text-sm font-medium text-[#C98291]">
//               <Crown size={16} />
//               Vendor Dashboard
//             </p>

//             <h1 className="font-serif text-3xl font-bold text-[#302925] sm:text-4xl">
//               Welcome back, {user.name}!
//             </h1>

//             <p className="mt-2 text-sm text-[#8B8179]">
//               Here&apos;s an overview of your wedding business.
//             </p>
//           </div>

//           <Link
//             href="/dashboard/add-service"
//             className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C98291] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B87583]"
//           >
//             <Plus size={18} />
//             Add New Service
//           </Link>
//         </div>

//         {/* Statistics */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           {stats.map((stat) => {
//             const Icon = stat.icon;

//             return (
//               <div
//                 key={stat.title}
//                 className="rounded-2xl border border-[#EDE3DA] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
//               >
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-[#8B8179]">
//                     {stat.title}
//                   </p>

//                   <div
//                     className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
//                   >
//                     <Icon size={22} />
//                   </div>
//                 </div>

//                 <h2 className="mt-3 font-serif text-3xl font-bold text-[#302925]">
//                   {stat.value}
//                 </h2>

//                 <p className="mt-2 text-xs text-[#A49A91]">
//                   {stat.description}
//                 </p>
//               </div>
//             );
//           })}
//         </div>

//         {/* Subscription */}
//         <div className="flex flex-col justify-between gap-5 rounded-2xl border border-[#EAD4B5] bg-[#F5EDE2] p-5 sm:flex-row sm:items-center sm:p-6">
//           <div className="flex items-start gap-4">
//             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#B98742]">
//               <Crown size={24} />
//             </div>

//             <div>
//               <div className="flex flex-wrap items-center gap-2">
//                 <h3 className="font-serif text-lg font-bold text-[#302925]">
//                   Grow Your Wedding Business
//                 </h3>

//                 <span
//                   className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                     isPremium
//                       ? "bg-amber-100 text-amber-700"
//                       : "bg-white text-[#8B8179]"
//                   }`}
//                 >
//                   {isPremium ? "Premium Plan" : "Free Plan"}
//                 </span>
//               </div>

//               <p className="mt-1 text-sm text-[#8B8179]">
//                 {isPremium
//                   ? "Enjoy unlimited active services and premium benefits."
//                   : "Your free plan allows up to 3 active services. Upgrade to publish unlimited services."}
//               </p>
//             </div>
//           </div>

//           {!isPremium && (
//             <Link
//               href="/dashboard/subscription"
//               className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#302925] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#453A33]"
//             >
//               Explore Premium
//               <ArrowUpRight size={17} />
//             </Link>
//           )}
//         </div>

//         {/* Service and Booking Overview */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

//           {/* Recent Bookings */}
//           <div className="overflow-hidden rounded-2xl border border-[#EDE3DA] bg-white">
//             <div className="flex items-center justify-between border-b border-[#F0EAE4] p-5">
//               <div>
//                 <h2 className="font-serif text-xl font-bold text-[#302925]">
//                   Recent Booking Requests
//                 </h2>
//                 <p className="mt-1 text-xs text-[#A49A91]">
//                   Manage your customer requests
//                 </p>
//               </div>

//               <Link
//                 href="/dashboard/booking-requests"
//                 className="flex items-center gap-1 text-sm font-semibold text-[#C98291] hover:text-[#A85F70]"
//               >
//                 View All
//                 <ArrowRight size={15} />
//               </Link>
//             </div>

//             <div className="divide-y divide-[#F0EAE4]">
//               {recentBookings.length > 0 ? (
//                 recentBookings.map((booking: any) => (
//                   <div
//                     key={booking._id || booking.id}
//                     className="flex flex-col gap-3 p-5 transition hover:bg-[#FDFBF9] sm:flex-row sm:items-center sm:justify-between"
//                   >
//                     <div className="min-w-0">
//                       <h3 className="truncate text-sm font-semibold text-[#302925]">
//                         {booking.serviceName || booking.service?.serviceName || "Wedding Service"}
//                       </h3>

//                       <p className="mt-1 flex items-center gap-1 text-xs text-[#8B8179]">
//                         <Users size={13} />
//                         {booking.customerName || booking.customer?.name || "Customer"}
//                       </p>

//                       <p className="mt-1 flex items-center gap-1 text-xs text-[#A49A91]">
//                         <CalendarDays size={13} />
//                         {booking.eventDate
//                           ? new Date(booking.eventDate).toLocaleDateString()
//                           : "Date not set"}
//                       </p>
//                     </div>

//                     <span
//                       className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
//                         booking.status
//                       )}`}
//                     >
//                       {booking.status}
//                     </span>
//                   </div>
//                 ))
//               ) : (
//                 <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
//                   <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F9E9EC] text-[#C98291]">
//                     <CalendarDays size={25} />
//                   </div>

//                   <h3 className="font-semibold text-[#302925]">
//                     No Booking Requests Yet
//                   </h3>

//                   <p className="mt-1 text-sm text-[#A49A91]">
//                     Customer requests will appear here.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* My Services */}
//           <div className="overflow-hidden rounded-2xl border border-[#EDE3DA] bg-white">
//             <div className="flex items-center justify-between border-b border-[#F0EAE4] p-5">
//               <div>
//                 <h2 className="font-serif text-xl font-bold text-[#302925]">
//                   My Services
//                 </h2>

//                 <p className="mt-1 text-xs text-[#A49A91]">
//                   Track your service approval status
//                 </p>
//               </div>

//               <Link
//                 href="/dashboard/services"
//                 className="flex items-center gap-1 text-sm font-semibold text-[#C98291] hover:text-[#A85F70]"
//               >
//                 View All
//                 <ArrowRight size={15} />
//               </Link>
//             </div>

//             <div className="divide-y divide-[#F0EAE4]">
//               {recentServices.length > 0 ? (
//                 recentServices.map((service: any) => (
//                   <div
//                     key={service._id || service.id}
//                     className="flex items-center gap-3 p-5 transition hover:bg-[#FDFBF9]"
//                   >
//                     <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F9E9EC]">
//                       {service.image ? (
//                         <Image
//                           src={service.image}
//                           alt={service.serviceName}
//                           fill
//                           sizes="56px"
//                           className="object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-full items-center justify-center text-[#C98291]">
//                           <BriefcaseBusiness size={22} />
//                         </div>
//                       )}
//                     </div>

//                     <div className="min-w-0 flex-1">
//                       <h3 className="truncate text-sm font-semibold text-[#302925]">
//                         {service.serviceName}
//                       </h3>

//                       <p className="mt-1 flex items-center gap-1 text-xs text-[#8B8179]">
//                         <MapPin size={12} />
//                         {service.location}
//                       </p>
//                     </div>

//                     <span
//                       className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
//                         service.status
//                       )}`}
//                     >
//                       {service.status}
//                     </span>
//                   </div>
//                 ))
//               ) : (
//                 <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
//                   <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F9E9EC] text-[#C98291]">
//                     <BriefcaseBusiness size={25} />
//                   </div>

//                   <h3 className="font-semibold text-[#302925]">
//                     No Services Added
//                   </h3>

//                   <p className="mt-1 text-sm text-[#A49A91]">
//                     Start by adding your first wedding service.
//                   </p>

//                   <Link
//                     href="/dashboard/add-service"
//                     className="mt-4 rounded-xl bg-[#C98291] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#B87583]"
//                   >
//                     Add Service
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Service Summary */}
//         <div className="rounded-2xl border border-[#EDE3DA] bg-white p-5 sm:p-6">
//           <div className="mb-5 flex items-center justify-between">
//             <div>
//               <h2 className="font-serif text-xl font-bold text-[#302925]">
//                 Service Approval Summary
//               </h2>

//               <p className="mt-1 text-sm text-[#A49A91]">
//                 Overview of your submitted services
//               </p>
//             </div>

//             <ClipboardList className="text-[#C98291]" size={24} />
//           </div>

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//             <div className="rounded-xl bg-green-50 p-4">
//               <div className="flex items-center gap-2 text-green-700">
//                 <CheckCircle2 size={18} />
//                 <span className="text-sm font-medium">Approved</span>
//               </div>

//               <p className="mt-2 text-2xl font-bold text-green-800">
//                 {activeServices}
//               </p>
//             </div>

//             <div className="rounded-xl bg-amber-50 p-4">
//               <div className="flex items-center gap-2 text-amber-700">
//                 <Clock size={18} />
//                 <span className="text-sm font-medium">Pending Review</span>
//               </div>

//               <p className="mt-2 text-2xl font-bold text-amber-800">
//                 {pendingServices}
//               </p>
//             </div>

//             <div className="rounded-xl bg-red-50 p-4">
//               <div className="flex items-center gap-2 text-red-600">
//                 <XCircle size={18} />
//                 <span className="text-sm font-medium">Rejected</span>
//               </div>

//               <p className="mt-2 text-2xl font-bold text-red-700">
//                 {rejectedServices}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div>
//           <h2 className="mb-4 font-serif text-xl font-bold text-[#302925]">
//             Quick Actions
//           </h2>

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <Link
//               href="/dashboard/add-service"
//               className="group flex items-center justify-between rounded-2xl border border-[#EDE3DA] bg-white p-5 transition hover:border-[#C98291] hover:shadow-md"
//             >
//               <div className="flex items-center gap-4">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9E9EC] text-[#C98291]">
//                   <Plus size={23} />
//                 </div>

//                 <div>
//                   <h3 className="font-semibold text-[#302925]">
//                     Add New Service
//                   </h3>

//                   <p className="mt-1 text-xs text-[#A49A91]">
//                     Publish a wedding service
//                   </p>
//                 </div>
//               </div>

//               <ArrowUpRight className="text-[#A49A91] transition group-hover:text-[#C98291]" />
//             </Link>

//             <Link
//               href="/dashboard/booking-requests"
//               className="group flex items-center justify-between rounded-2xl border border-[#EDE3DA] bg-white p-5 transition hover:border-[#C98291] hover:shadow-md"
//             >
//               <div className="flex items-center gap-4">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9E9EC] text-[#C98291]">
//                   <CalendarDays size={23} />
//                 </div>

//                 <div>
//                   <h3 className="font-semibold text-[#302925]">
//                     Manage Bookings
//                   </h3>

//                   <p className="mt-1 text-xs text-[#A49A91]">
//                     Review customer requests
//                   </p>
//                 </div>
//               </div>

//               <ArrowUpRight className="text-[#A49A91] transition group-hover:text-[#C98291]" />
//             </Link>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default VendorDashboard;
