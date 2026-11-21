"use client";

import { useEffect, useState } from "react";
import { Loader2, ReceiptText } from "lucide-react";
import { toast } from "react-hot-toast";
import { GetTransactions } from "@/lib/actions/payments";

interface Transaction {
  _id?: string;
  vendorId?: string;
  vendorName?: string;
  vendorEmail?: string;
  plan?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  createdAt?: string | Date;
}

const getTransactions = (result: unknown): Transaction[] => {
  if (Array.isArray(result)) return result as Transaction[];
  if (!result || typeof result !== "object") return [];
  const response = result as { transactions?: unknown; data?: unknown };
  if (Array.isArray(response.transactions)) return response.transactions as Transaction[];
  if (Array.isArray(response.data)) return response.data as Transaction[];
  return [];
};

const formatAmount = (transaction: Transaction) => {
  if (transaction.amount === undefined || transaction.amount === null) return "N/A";
  const amount = Number(transaction.amount);
  if (!Number.isFinite(amount)) return "N/A";
  const currency = transaction.currency?.trim().toUpperCase() || "N/A";
  return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const formatDate = (value?: string | Date) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
};

const statusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
    case "succeeded":
    case "success":
      return "bg-green-50 text-green-700";
    case "failed":
    case "canceled":
    case "cancelled":
    case "expired":
      return "bg-red-50 text-red-700";
    case "pending":
    case "processing":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadTransactions = async () => {
      try {
        const result = await GetTransactions();
        if (mounted) setTransactions(getTransactions(result));
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : "Failed to load transactions.";
        if (mounted) setError(message);
        toast.error(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void loadTransactions();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-[#94774f]">Admin Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-[#292820]">Transactions</h1>
        <p className="mt-2 text-sm text-gray-500">View Premium subscription payment transactions.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8e1d7] bg-white">
        <div className="flex items-center justify-between border-b border-[#e8e1d7] px-5 py-4">
          <div>
            <h2 className="font-semibold text-[#292820]">Payment History</h2>
            <p className="mt-1 text-xs text-gray-500">Actual records from the transactions collection.</p>
          </div>
          <ReceiptText className="text-[#94774f]" size={22} />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#94774f]" size={30} /></div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-600">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-sm text-gray-500"><ReceiptText size={30} />No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-[#faf8f5] text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Vendor Information</th>
                  <th className="px-5 py-4">Subscription Plan</th>
                  <th className="px-5 py-4">Payment Amount</th>
                  <th className="px-5 py-4">Payment Status</th>
                  <th className="px-5 py-4">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction, index) => {
                  const status = transaction.status || "N/A";
                  const vendorName = transaction.vendorName || "Vendor information unavailable";
                  const vendorDetail = transaction.vendorEmail || transaction.vendorId || "";
                  return (
                    <tr key={transaction._id || transaction.vendorId || index} className="text-sm">
                      <td className="px-5 py-4"><p className="font-semibold text-[#292820]">{vendorName}</p>{vendorDetail && <p className="mt-1 text-xs text-gray-500">{vendorDetail}</p>}</td>
                      <td className="px-5 py-4"><span className="rounded-full bg-[#f7f0e6] px-3 py-1 text-xs font-semibold capitalize text-[#94774f]">{transaction.plan || "N/A"}</span></td>
                      <td className="px-5 py-4 font-semibold text-[#292820]">{formatAmount(transaction)}</td>
                      <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyle(status)}`}>{status}</span></td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">{formatDate(transaction.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
