export interface Service {
  _id?: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image: string;
  vendorId: string;
  vendorName: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}