import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#94774f]" />
        <p className="text-sm font-medium text-[#94774f]">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default Loading;