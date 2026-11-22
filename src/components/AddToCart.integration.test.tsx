import { screen, fireEvent } from "@testing-library/react";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import { renderWithProviders } from "../test/renderWithProviders";
import { testProduct } from "../test/testProduct";

describe("Adding a product to the cart", () => {
  it("updates the cart count in the NavBar", () => {
    renderWithProviders(
      <>
        <NavBar />
        <ProductCard product={testProduct} />
      </>
    );

    const cartLink = screen.getByRole("link", { name: /cart/i });
    expect(cartLink).toHaveTextContent("Cart 0");

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);
    expect(cartLink).toHaveTextContent("Cart 1");

    fireEvent.click(addButton);
    expect(cartLink).toHaveTextContent("Cart 2");
  });
});
