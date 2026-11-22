import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "../types";
import type { RootState } from "./store";


const STORAGE_KEY = "cart";

const loadCart = (): CartItem[] => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  } catch {
    return []; 
  }
};

export const saveCart = (items: CartItem[]) => {
  if (items.length === 0) {
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

interface CartState {
  items: CartItem[];
}


const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.count += 1;
      } else {
        state.items.push({ ...action.payload, count: 1 });
      }
    },

    updateCount: (
      state,
      action: PayloadAction<{ id: string; count: number }>
    ) => {
      const { id, count } = action.payload;
      if (count < 1) {
        state.items = state.items.filter((item) => item.id !== id);
        return;
      }
      const item = state.items.find((i) => i.id === id);
      if (item) item.count = count;
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});


export const { addToCart, updateCount, removeFromCart, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;


export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.count, 0);

export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.count, 0);

export default cartSlice.reducer;