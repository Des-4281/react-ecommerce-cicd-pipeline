import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, fetchCategories, fetchProducts, fetchProductsByCategory, seedProductsFromFakeStore, updateProduct, } from "../api/products";                      
import type { ProductInput } from "../types";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

export const useProducts = (category: string) =>
  useQuery({
    queryKey: ["products", category],
    queryFn: () =>
      category ? fetchProductsByCategory(category) : fetchProducts(),
  });  

  export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  return {
    create: useMutation({ mutationFn: createProduct, onSuccess: refresh }),
    update: useMutation({
      mutationFn: ({ id, changes }: { id: string; changes: Partial<ProductInput> }) =>
        updateProduct(id, changes),
      onSuccess: refresh,
    }),
    remove: useMutation({ mutationFn: deleteProduct, onSuccess: refresh }),
    seed: useMutation({ mutationFn: seedProductsFromFakeStore, onSuccess: refresh }),
  };
};

  