
'use client'

import { useEffect, useState } from "react";
import {
  Search,
  BriefcaseBusiness,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Eye,
  Check,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  GetServices,
  ApproveService,
  RejectService,
  DeleteService,
} from "@/lib/actions/services";

interface Service {
  _id: string;
  serviceName: string;
  category?: string;
  description?: string;
  price?: string | number;
  image?: string;
  location?: string;
  vendorName?: string;
  status?: string;
}

const ManageServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await GetServices();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleStatusUpdate = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    try {
      setUpdating(id);

      const result =
        action === "approve"
          ? await ApproveService(id)
          : await RejectService(id);

      if (result.success === false) {
        throw new Error(result.message || "Failed to update service");
      }

      setServices((prev) =>
        prev.map((service) =>
          service._id === id
            ? {
                ...service,
                status: action === "approve" ? "approved" : "rejected",
              }
            : service
        )
      );

      toast.success(
        action === "approve"
          ? "Service approved successfully"
          : "Service rejected successfully"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (updating) return;
    try {
      setUpdating(id);
      const result = await DeleteService(id);
      if (result.success === false) {
        throw new Error(result.message || "Failed to delete service");
      }
      setServices((prev) => prev.filter((service) => service._id !== id));
      toast.success("Service deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete service");
    } finally {
      setUpdating(null);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      service.category?.toLowerCase().includes(search.toLowerCase()) ||
      service.vendorName?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "all" || (service.status || "pending") === status;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = services.filter(
    (service) => (service.status || "pending") === "pending"
  ).length;

  const approvedCount = services.filter(
    (service) => service.status === "approved"
  ).length;

  const rejectedCount = services.filter(
    (service) => service.status === "rejected"
  ).length;

  const getStatusStyle = (value?: string) => {
    switch (value || "pending") {
      case "approved":
        return "bg-green-50 text-green-700";
      case "rejected":
        return "bg-red-50 text-red-600";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-[#94774f]">
          Admin Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#292820]">
          Manage Services
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Review, approve and manage vendor submitted services.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#e8e1d7] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Services</p>
            <BriefcaseBusiness className="text-[#94774f]" size={22} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-[#292820]">
            {services.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#e8e1d7] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Pending</p>
            <Clock className="text-amber-600" size={22} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-[#292820]">
            {pendingCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#e8e1d7] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Approved</p>
            <CheckCircle2 className="text-green-600" size={22} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-[#292820]">
            {approvedCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#e8e1d7] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Rejected</p>
            <XCircle className="text-red-500" size={22} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-[#292820]">
            {rejectedCount}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e8e1d7] bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search service, category or vendor..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#94774f]"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#94774f]"
          >
            <option value="all">All Services</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8e1d7] bg-white">
        <div className="border-b border-[#eee8df] px-5 py-4">
          <h2 className="font-semibold text-[#292820]">
            All Vendor Services ({filteredServices.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[#94774f]" size={30} />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No services found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-[#faf8f5] text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="text-sm">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.serviceName}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f2eadf]">
                            <BriefcaseBusiness
                              size={20}
                              className="text-[#94774f]"
                            />
                          </div>
                        )}

                        <div className="max-w-[230px]">
                          <p className="font-semibold text-[#292820]">
                            {service.serviceName || "Untitled Service"}
                          </p>
                          <p className="mt-1 truncate text-xs text-gray-500">
                            {service.vendorName || "Vendor"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {service.category || "N/A"}
                    </td>

                    <td className="px-5 py-4 font-medium text-[#292820]">
                      {service.price ? `৳${service.price}` : "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                          service.status
                        )}`}
                      >
                        {service.status || "pending"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {service.status !== "approved" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(service._id, "approve")
                            }
                            disabled={updating === service._id}
                            className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
                          >
                            {updating === service._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Check size={14} />
                            )}
                            Approve
                          </button>
                        )}

                        {service.status !== "rejected" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(service._id, "reject")
                            }
                            disabled={updating === service._id}
                            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                          >
                            <X size={14} />
                            Reject
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(service._id)}
                          disabled={updating === service._id}
                          className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServices;
