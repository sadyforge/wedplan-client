import { Suspense } from "react";
import Banner from "./HomePageComponents/Banner";
import HomeServices from "./HomePageComponents/HomeServices";
import HomeServiceCards from "./HomePageComponents/services";
import { Loader2 } from "lucide-react";

export default function Home() {
  return (
  <div>
    <Banner/>
       <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#94774f]" />
          </div>
        }
      >
        <HomeServices />
      </Suspense>
    <HomeServiceCards/>
  </div>
  );
}
