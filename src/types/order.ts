export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed";

export interface OrderItem {
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalValue: number;
  status: OrderStatus;
  createdAt: string;
  size?: string;
}

export type View =
  | "home"
  | "order-form"
  | "confirmation"
  | "admin"
  | "shipping-policy"
  | "returns-exchanges"
  | "contact-us";
export type AdminTab = "orders" | "batching";

export interface CheckoutFormState {
  name: string;
  phone: string;
  address: string;
  cart: OrderItem[];
}
