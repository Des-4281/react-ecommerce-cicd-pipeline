import { screen, fireEvent } from "@testing-library/react";
import ProductCard from "./ProductCard";
import { renderWithProviders } from "../test/renderWithProviders";
import { testProduct } from "../test/testProduct";

describe("ProductCard", () => {
  it("shows the product's title, price, category, and image", () => {
    renderWithProviders(<ProductCard product={testProduct} />);

    expect(screen.getByText("Test Backpack")).toBeInTheDocument();
    expect(screen.getByText("$49.99")).toBeInTheDocument();
    expect(screen.getByText("bags")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Test Backpack" })).toBeInTheDocument();
  });

  it("adds the product to the cart when Add to Cart is clicked", () => {
    const { store } = renderWithProviders(<ProductCard product={testProduct} />);

    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    const items = store.getState().cart.items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: "abc123", count: 1 });
  });
});