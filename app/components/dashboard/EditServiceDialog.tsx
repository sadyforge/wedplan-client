
"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import { UpdateServices } from "@/lib/actions/services";
import { toast } from "react-hot-toast";

type Service = {
  _id?: string;
  id?: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image: string;
};

type EditServiceDialogProps = {
  service: Service;
  children: ReactNode;
};

export default function EditServiceDialog({
  service,
  children,
}: EditServiceDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(service.image || "");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = service._id || service.id;

    if (!id) {
      toast.error("Service ID not found.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);

      let imageUrl = service.image;

      if (imageFile) {
        const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY;

        if (!apiKey) {
          toast.error("Image upload API key is missing.");
          return;
        }

        const imageData = new FormData();
        imageData.append("image", imageFile);

        const imageResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: imageData,
          }
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok || !imageResult.success) {
          toast.error("Image upload failed.");
          return;
        }

        imageUrl = imageResult.data.url;
      }

      const updatedData = {
        serviceName: formData.get("serviceName") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        location: formData.get("location") as string,
        image: imageUrl,
      };

      const result = await UpdateServices(id, updatedData);

      if (!result.success) {
        toast.error(result.message || "Failed to update service.");
        return;
      }

      toast.success("Service updated successfully!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (value) {
          setImageFile(null);
          setPreview(service.image || "");
        }
      }}
    >
      <DialogTrigger render={children as React.ReactElement} />

      <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#F8F4EF] sm:max-w-lg">
        <form onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#302925]">
              Edit Service
            </DialogTitle>

            <DialogDescription className="text-[#81766F]">
              Update your wedding service information here.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-6">
            <Field>
              <Label htmlFor="serviceName">Service Name</Label>
              <Input
                id="serviceName"
                name="serviceName"
                defaultValue={service.serviceName}
                required
              />
            </Field>

            <Field>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                required
                defaultValue={service.category}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-[#C98291]"
              >
                <option value="Photography & Videography">
                  Photography & Videography
                </option>
                <option value="Wedding Venues">Wedding Venues</option>
                <option value="Decoration & Florist">
                  Decoration & Florist
                </option>
                <option value="Catering Services">Catering Services</option>
                <option value="Makeup & Styling">Makeup & Styling</option>
                <option value="Wedding Fashion">Wedding Fashion</option>
              </select>
            </Field>

            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={service.description}
                rows={4}
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor="price">Price (৳)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  defaultValue={service.price}
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={service.location}
                  required
                />
              </Field>
            </div>

            <Field>
              <Label htmlFor="image">Service Image</Label>

              {preview && (
                <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#E7DDD3]">
                  <img
                    src={preview}
                    alt="Service preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <label
                htmlFor="image"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#C98291] bg-white px-4 py-4 text-sm font-medium text-[#C98291] transition hover:bg-[#F9E9EC]"
              >
                <ImagePlus size={18} />
                {imageFile ? imageFile.name : "Choose New Image"}
              </label>

              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <p className="text-xs text-[#A49A92]">
                Select a new image to replace the current one. Maximum size 5MB.
              </p>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              }
            />

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#C98291] text-white hover:bg-[#B66E7E]"
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
