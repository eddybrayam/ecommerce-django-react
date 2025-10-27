import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🧠 Contextos
import { CartProvider } from "./context/CartContext";
import { CouponProvider } from "./context/CouponContext"; // ✅ nuevo contexto

// 🧱 Páginas
import Login from "./pages/Login";
import RegisterClient from "./pages/RegisterClient";
import Activate from "./pages/Activate";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail";
import AccountPage from "./pages/AccountPage/AccountPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import Checkout from "./pages/Checkout";
import PaymentPage from "./pages/PaymentPage";

function App() {
  return (
    <CartProvider>
      <CouponProvider> {/* ✅ Nuevo: proveedor de cupones envuelve toda la app */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterClient />} />
            <Route path="/activate/:uidb64/:token" element={<Activate />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Rutas protegidas (aún sin autenticación implementada) */}
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/orders" element={<OrdersPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />

            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </BrowserRouter>
      </CouponProvider>
    </CartProvider>
  );
}

export default App;
