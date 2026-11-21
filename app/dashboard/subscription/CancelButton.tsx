"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { CancelSubscription } from "@/lib/actions/payments";

export default function CancelButton() {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await CancelSubscription();
      toast.success("Cancellation scheduled for the end of your billing period.");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Cancellation failed.");
    }
  };

  return (
    <button type="button" onClick={handleCancel} disabled={loading} className="mt-4 text-xs font-semibold text-[#B66E7E] underline disabled:opacity-60">
      {loading ? <><Loader2 size={13} className="mr-1 inline animate-spin" />Processing...</> : "Cancel at period end"}
    </button>
  );
}
