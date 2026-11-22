import {
  addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where, writeBatch,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Product, ProductInput } from "../types";
import { fetchProducts as fetchFakeStoreProducts } from "./fakeStore";

const productsRef = collection(db, "products");

export const fetchProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
};


export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const snapshot = await getDocs(query(productsRef, where("category", "==", category)));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
};

export const fetchCategories = async (): Promise<string[]> => {
  const products = await fetchProducts();
  return [...new Set(products.map((p) => p.category))].sort();
};

export const createProduct = (product: ProductInput) => addDoc(productsRef, product);

export const updateProduct = (id: string, changes: Partial<ProductInput>) =>
  updateDoc(doc(db, "products", id), changes);

export const deleteProduct = (id: string) => deleteDoc(doc(db, "products", id));

export const seedProductsFromFakeStore = async (): Promise<number> => {
  const fakeProducts = await fetchFakeStoreProducts();
  const batch = writeBatch(db);
  fakeProducts.forEach((p) => {
    batch.set(doc(productsRef), {
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category,
      image: p.image,
      rating: p.rating,
    });
  });
  await batch.commit();
  return fakeProducts.length;
};
