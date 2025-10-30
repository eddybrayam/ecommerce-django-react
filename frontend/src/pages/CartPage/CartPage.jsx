// src/pages/CartPage/CartPage.jsx
import { useCart } from "../../context/CartContext";
import { Trash2 } from "lucide-react";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, total, removeFromCart, clearCart } = useCart();

  // ✅ Calcular IGV y subtotal
  const igv = total * 0.18;
  const subtotal = total - igv;

  return (
    <div className="cart-page">
      <h1>🛒 Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <img src={item.image} alt={item.name} className="cart-img" />
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>Precio unitario: S/ {item.price.toFixed(2)}</p>

                  {/* ✅ Mostrar cantidad y total por producto */}
                  <p>Cantidad: x{item.quantity}</p>
                  <p>
                    <strong>
                      Total: S/ {(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </p>
                </div>

                {/* Botón eliminar */}
                <button
                  className="btn-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* ✅ Resumen del carrito */}
          <div className="cart-summary">
            <p>
              Subtotal: <span>S/ {subtotal.toFixed(2)}</span>
            </p>
            <p>
              IGV (18%): <span>S/ {igv.toFixed(2)}</span>
            </p>
            <hr />
            <h3>
              Total general: <span>S/ {total.toFixed(2)}</span>
            </h3>

            <div className="cart-actions">
              <button className="btn-clear" onClick={clearCart}>
                Vaciar carrito
              </button>
              <button
                className="btn-checkout"
                onClick={() => navigate("/checkout")} // ✅ redirige al checkout
              >
                Proceder al pago
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
