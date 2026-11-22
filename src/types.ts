import type { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  count: number;
}

export interface UserProfile {
  email: string;
  name: string;
  address: string;
  createdAt?: Timestamp;
}

export type ProductInput = Omit<Product, "id">;

export type OrderItem = Pick<CartItem, "id" | "title" | "price" | "image" | "count">;

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalItems: number;
  total: number;
  createdAt: Timestamp | null;   
}
