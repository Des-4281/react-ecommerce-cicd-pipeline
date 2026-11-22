import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import type { User } from "firebase/auth";
import cartReducer from "../redux/cartSlice";
import { AuthContext } from "../context/authContext";


interface Options {
  user?: User | null;
}


export const renderWithProviders = (ui: ReactElement, { user = null }: Options = {}) => {
  const store = configureStore({ reducer: { cart: cartReducer } });


  render(
    <Provider store={store}>
      <MemoryRouter>
        <AuthContext.Provider value={{ user, loading: false }}>{ui}</AuthContext.Provider>
      </MemoryRouter>
    </Provider>
  );

  return { store };
};