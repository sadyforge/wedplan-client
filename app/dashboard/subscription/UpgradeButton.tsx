"use client";

import { useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { CreateCheckoutSession } from "@/lib/actions/payments";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await CreateCheckoutSession();
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Unable to start checkout.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleUpgrade}
      className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#C98291] py-3 text-sm font-bold text-white transition hover:bg-[#B66E7E] disabled:cursor-not-allowed disabled:opacity-70"
      disabled={loading}
    >
        {loading ? <><Loader2 size={17} className="animate-spin" />Redirecting to checkout...</> : <>
          Upgrade to Premium
          <ArrowUpRight size={17} />
        </>}
    </button>
  );
}
