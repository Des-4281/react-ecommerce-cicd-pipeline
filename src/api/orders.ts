import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where, } from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { CartItem, Order, OrderItem } from "../types";

const ordersRef = collection(db, "orders");

export const createOrder = async (userId: string, cartItems: CartItem[]): Promise<string> => {

  const items: OrderItem[] = cartItems.map(({ id, title, price, image, count }) => ({
    id, title, price, image, count,
  }));
  const totalItems = items.reduce((sum, item) => sum + item.count, 0);
  const total =
    Math.round(items.reduce((sum, item) => sum + item.price * item.count, 0) * 100) / 100;

  const ref = await addDoc(ordersRef, {
    userId,
    items,
    totalItems,
    total,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  const snapshot = await getDocs(query(ordersRef, where("userId", "==", userId)));
  const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
  return orders.sort(
    (a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
  );
};

export const fetchOrder = async (orderId: string): Promise<Order> => {
  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) throw new Error("Order not found.");
  return { id: snap.id, ...snap.data() } as Order;
};

export const formatOrderDate = (order: Order) =>
  order.createdAt ? order.createdAt.toDate().toLocaleString() : "Just now";