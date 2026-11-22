import type { Product } from "../types";

const BASE_URL = "https://fakestoreapi.com";

const getJson = async <T,>(path: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const fetchProducts = () => getJson<Product[]>("/products");

export const fetchCategories = () => getJson<string[]>("/products/categories");

export const fetchProductsByCategory = (category: string) =>
  getJson<Product[]>(`/products/category/${encodeURIComponent(category)}`);
