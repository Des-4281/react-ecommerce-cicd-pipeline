import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder, fetchOrder, fetchUserOrders } from "../api/orders";
import type { CartItem } from "../types";

export const useOrders = (userId: string | undefined) =>
  useQuery({
    queryKey: ["orders", userId],
    queryFn: () => fetchUserOrders(userId!),
    enabled: !!userId,
  });

export const useOrder = (orderId: string | undefined) =>
  useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId!),
    enabled: !!orderId,
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, items }: { userId: string; items: CartItem[] }) =>
      createOrder(userId, items),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }), 
  });
};
