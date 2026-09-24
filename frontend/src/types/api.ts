// Mirrors the DTOs in CrumbTheoryAPI/Models

export type BakeryItem = {
   id: string;
   name: string;
   price: number;
   description: string | null;
   imageUrl: string | null;
   isAvailable: boolean;
};

export type BakeryItemInput = Omit<BakeryItem, "id"> & { id?: string };

export const ORDER_STATUSES = ["Pending", "Confirmed", "Ready", "Collected", "Cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = {
   bakeryItemId: string;
   itemName: string;
   unitPrice: number;
   quantity: number;
};

export type Order = {
   id: string;
   customerName: string;
   email: string;
   phone: string;
   pickupDate: string; // YYYY-MM-DD
   notes: string | null;
   status: OrderStatus;
   createdAt: string;
   total: number;
   items: OrderItem[];
};

export type CreateOrderRequest = {
   customerName: string;
   email: string;
   phone: string;
   pickupDate: string;
   notes?: string;
   items: { bakeryItemId: string; quantity: number }[];
};

export type LoginResponse = {
   token: string;
   expiresAt: string;
};
