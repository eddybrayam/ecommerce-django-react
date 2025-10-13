import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, LogOut, Zap, ShoppingCart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./CartNavbar.css";

export default function CartNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth() || {};
  const { cartItems } = useCart();

  const itemCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <nav className="cart-navbar">


      {/* 🏪 Nombre de la tienda */}
      <div className="store-name">
        <Zap size={22} className="store-icon" />
        <h2>SmartShop</h2>
      </div>

      <div className="right-actions">
        {/* 🛒 Carrito con contador */}
        <Link to="/cart" className="cart-icon">
          <ShoppingCart size={26} />
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </Link>

        {/* 🚪 Logout */}
        {user ? (
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={26} />
          </button>
        ) : (
          <button className="logout-button" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
