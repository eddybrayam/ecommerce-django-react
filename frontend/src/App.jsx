import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import RegisterClient from "./pages/RegisterClient";
import Activate from "./pages/Activate";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail";
// Nuevas páginas
import AccountPage from "./pages/AccountPage/AccountPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import AgotadoPage from "./pages/AgotadoPage"; // 👈 nueva página

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterClient />} />
        <Route path="/activate/:uidb64/:token" element={<Activate />} />

        {/* Carrito */}
        <Route path="/cart" element={<CartPage />} />

        {/* Nueva página de prueba para Agotado */}
        <Route path="/agotado" element={<AgotadoPage />} />

        {/* Páginas de usuario */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />

        {/* Detalle del producto */}
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

