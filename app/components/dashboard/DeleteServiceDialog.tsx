
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteServices } from "@/lib/actions/services";
import { toast } from "react-hot-toast";

type DeleteServiceDialogProps = {
  serviceId: string;
  serviceName: string;
};

export default function DeleteServiceDialog({
  serviceId,
  serviceName,
}: DeleteServiceDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const result = await DeleteServices(serviceId);

      if (!result.success) {
        toast.error(result.message || "Failed to delete service.");
        return;
      }

      toast.success("Service deleted successfully!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label="Delete service"
            className="h-10 w-10 rounded-xl border-[#EDE3DA] text-[#A87249] transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </Button>
        }
      />

      <DialogContent className="bg-[#F8F4EF] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#302925]">
            Delete Service?
          </DialogTitle>

          <DialogDescription className="text-[#81766F]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#302925]">
              {serviceName}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5">
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            }
          />

          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
