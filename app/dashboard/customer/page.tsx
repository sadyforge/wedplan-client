import { requireDashboardRole } from "@/lib/dashboard-auth";
import CustomerOverview from "./CustomerOverview";

export const instant = false;

const CustomerPage = async () => {
  await requireDashboardRole(["customer"]);

  return <CustomerOverview />;
};

export default CustomerPage;