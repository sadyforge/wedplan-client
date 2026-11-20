import { requireDashboardRole } from "@/lib/dashboard-auth";
import VendorOverview from "./VendorOverview";

export const instant = false;

const VendorPage = async () => {
  const { session } = await requireDashboardRole(["vendor"]);

  return (
    <VendorOverview
      vendorId={session.user.id}
      vendorEmail={session.user.email}
      subscriptionPlan={
        (session.user as { subscriptionPlan?: string }).subscriptionPlan ||
        "Free"
      }
    />
  );
};

export default VendorPage;