
import { requireDashboardRole } from "@/lib/dashboard-auth";
import { headers } from "next/headers";
import { GetAllUsers } from "@/lib/actions/users";
import { GetServices } from "@/lib/actions/services";
import { GetTransactions } from "@/lib/actions/payments";
import {
  Users,
  Store,
  UserRound,
  BriefcaseBusiness,
  Clock,
  Crown,
  ReceiptText,
} from "lucide-react";

export const instant = false;

type Data = Record<string, unknown>;

const getArray = (result: unknown): Data[] => {
  if (Array.isArray(result)) return result as Data[];

  if (result && typeof result === "object") {
    const data = result as Data;

    for (const key of ["users", "services", "transactions", "data", "results"]) {
      if (Array.isArray(data[key])) return data[key] as Data[];
    }
  }

  return [];
};

const AdminPage = async () => {
  await requireDashboardRole(["admin"]);
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie") || undefined;

  const [usersResult, servicesResult, transactionsResult] =
    await Promise.allSettled([
      GetAllUsers(cookie),
      GetServices(cookie),
      GetTransactions(cookie),
    ]);

  const users =
    usersResult.status === "fulfilled" ? getArray(usersResult.value) : [];

  const services =
    servicesResult.status === "fulfilled"
      ? getArray(servicesResult.value)
      : [];

  const transactions =
    transactionsResult.status === "fulfilled"
      ? getArray(transactionsResult.value)
      : [];

  const getStatus = (item: Data) =>
    String(item.status || item.serviceStatus || "").toLowerCase();

  const vendors = users.filter(
    (user) => String(user.role || "").toLowerCase() === "vendor"
  );

  const customers = users.filter(
    (user) => String(user.role || "").toLowerCase() === "customer"
  );

  const premiumVendors = vendors.filter(
    (vendor) =>
      String(vendor.subscriptionPlan || vendor.plan || "").toLowerCase() ===
        "premium" &&
      String(vendor.subscriptionStatus || "").toLowerCase() === "active"
  );

  const pendingServices = services.filter(
    (service) => getStatus(service) === "pending"
  );

  const approvedServices = services.filter(
    (service) => getStatus(service) === "approved"
  );

  const rejectedServices = services.filter(
    (service) => getStatus(service) === "rejected"
  );

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Vendors",
      value: vendors.length,
      icon: Store,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total Customers",
      value: customers.length,
      icon: UserRound,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Total Services",
      value: services.length,
      icon: BriefcaseBusiness,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Pending Services",
      value: pendingServices.length,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Total Transactions",
      value: transactions.length,
      icon: ReceiptText,
      color: "bg-pink-50 text-pink-600",
    },
  ];

  const dataErrors = [
    usersResult.status === "rejected" && "Users",
    servicesResult.status === "rejected" && "Services",
    transactionsResult.status === "rejected" && "Transactions",
  ].filter(Boolean);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-[#94774f]">
          Admin Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#292820]">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Monitor users, vendors, services and Premium subscriptions.
        </p>
      </div>

      {dataErrors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Failed to load: {dataErrors.join(", ")}. Please check your API.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#e8e1d7] bg-white p-5 transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="mt-5 text-3xl font-bold text-[#292820]">
                {stat.value.toLocaleString()}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#e8e1d7] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#f7f0e6] p-3 text-[#94774f]">
              <Crown size={23} />
            </div>
            <div>
              <h2 className="font-bold text-[#292820]">
                Premium Subscription
              </h2>
              <p className="text-xs text-gray-500">
                Vendor subscription overview
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Total Vendors
              </span>
              <span className="font-semibold text-[#292820]">
                {vendors.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Active Premium Vendors
              </span>
              <span className="font-semibold text-green-600">
                {premiumVendors.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Free Vendors
              </span>
              <span className="font-semibold text-[#292820]">
                {vendors.length - premiumVendors.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Total Transactions
              </span>
              <span className="font-semibold text-[#292820]">
                {transactions.length}
              </span>
            </div>
          </div>

          <a
            href="/dashboard/admin/transactions"
            className="mt-7 flex items-center justify-center rounded-xl bg-[#292820] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#94774f]"
          >
            View Transactions
          </a>
        </div>

        <div className="rounded-2xl border border-[#e8e1d7] bg-white p-6">
          <h2 className="font-bold text-[#292820]">
            Service Management Overview
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Current service approval statistics
          </p>

          <div className="mt-6 space-y-5">
            {[
              {
                title: "Pending",
                count: pendingServices.length,
                color: "bg-yellow-500",
              },
              {
                title: "Approved",
                count: approvedServices.length,
                color: "bg-green-500",
              },
              {
                title: "Rejected",
                count: rejectedServices.length,
                color: "bg-red-500",
              },
            ].map((item) => (
              <div key={item.title}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600">{item.title}</span>
                  <span className="font-semibold text-[#292820]">
                    {item.count}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${
                        services.length
                          ? (item.count / services.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
