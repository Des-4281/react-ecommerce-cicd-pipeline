import { screen, fireEvent } from "@testing-library/react";
import type { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import NavBar from "./NavBar";
import { renderWithProviders } from "../test/renderWithProviders";

describe("NavBar", () => {
  it("shows Login and Register when nobody is logged in", () => {
    renderWithProviders(<NavBar />);

    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
  });

  it("shows the user's email and logs out when Logout is clicked", () => {
    const fakeUser = { email: "test@example.com" } as User;
    renderWithProviders(<NavBar />, { user: fakeUser });

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    expect(signOut).toHaveBeenCalled();
  });
});
