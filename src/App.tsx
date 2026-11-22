import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RequireAuth from "./components/RequireAuth";
import AdminProductsPage from "./pages/AdminProductsPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderDetailPage from "./pages/OrderDetailPage";

const App = () => (
  <>
    <NavBar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin/products" element={<RequireAuth><AdminProductsPage /></RequireAuth>} />
      <Route path="/orders" element={<RequireAuth><OrderHistoryPage /></RequireAuth>} />
      <Route path="/orders/:orderId" element={<RequireAuth><OrderDetailPage /></RequireAuth>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>
);

export default App;
