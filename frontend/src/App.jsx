import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "./pages/Login";
import RegisterClient from "./pages/RegisterClient";
import Activate from "./pages/Activate";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail";
// Nuevas páginas (placeholders)
import AccountPage from "./pages/AccountPage/AccountPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/**<Route path="/" element={<TechStoreHomepage />} /> */}
        <Route path="/" element={<Home />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterClient />} />
        <Route path="/activate/:uidb64/:token" element={<Activate />} />
        <Route path="/cart" element={<CartPage />} />

                {/* Rutas protegidas (solo accesibles si estás logueado, aunque por ahora no están protegidas aún) */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />


        <Route path="/product/:id" element={<ProductDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
