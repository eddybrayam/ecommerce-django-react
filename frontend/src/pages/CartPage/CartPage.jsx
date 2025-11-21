// src/pages/CartPage/CartPage.jsx
import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { Trash2 } from "lucide-react";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { BASE_URL } from "../../services/api";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, total, removeFromCart, clearCart, updateQuantity } = useCart();

  // ✅ Calcular IGV y subtotal
  const igv = total * 0.18;
  const subtotal = total - igv;

  // 🟡 Sincronizar stock real desde el backend
  useEffect(() => {
    if (cartItems.length === 0) return;

    const syncStock = async () => {
      try {
        const updates = await Promise.all(
          cartItems.map(async (item) => {
            try {
              const res = await fetch(`${BASE_URL}/api/products/${item.id}/`);
              if (!res.ok) throw new Error("No se pudo obtener producto");
              const data = await res.json();

              const realStock = data.stock ?? data.cantidad_stock ?? 0;

              // Si la cantidad en carrito es mayor al stock real, la ajustamos
              if (item.quantity > realStock) {
                updateQuantity(item.id, Math.max(1, realStock));
              }

              // Devolvemos el nuevo stock para este ítem
              return { id: item.id, stock: realStock };
            } catch (err) {
              console.error("Error sincronizando stock:", err);
              // Si falla, mantenemos el stock que ya tenía
              return { id: item.id, stock: item.stock ?? null };
            }
          })
        );

        // Actualizar el stock dentro de cada item del carrito
        // (sin tocar el contexto directamente, lo hacemos con updateQuantity + truco)
        // Como sólo necesitamos que se vea correcto, actualizamos el objeto en memoria:
        updates.forEach(({ id, stock }) => {
          const item = cartItems.find((p) => p.id === id);
          if (item) {
            item.stock = stock;
          }
        });
      } catch (e) {
        console.error("Error general sincronizando stock:", e);
      }
    };

    syncStock();
  }, [cartItems, updateQuantity]);

  const handleDecrease = (item) => {
    if (item.quantity <= 1) return;
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = (item) => {
    const stock = item.stock ?? Infinity;
    if (item.quantity >= stock) return;
    updateQuantity(item.id, item.quantity + 1);
  };

  return (
    <>
      <Navbar />

      <div className="cart-page">
        <h1>🛒 Carrito de Compras</h1>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => {
                const stock = item.stock ?? null;

                return (
                  <div key={item.id} className="cart-item-row">
                    <img src={item.image} alt={item.name} className="cart-img" />

                    <div className="cart-info">
                      <h3>{item.name}</h3>
                      <p>Precio unitario: S/ {item.price.toFixed(2)}</p>

                      {/* Controles de cantidad */}
                      <div className="cart-qty">
                        <span>Cantidad:</span>
                        <div className="cart-qty-controls">
                          <button
                            className="qty-btn"
                            onClick={() => handleDecrease(item)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            readOnly
                            className="qty-input"
                          />
                          <button
                            className="qty-btn"
                            onClick={() => handleIncrease(item)}
                            disabled={stock !== null && item.quantity >= stock}
                          >
                            +
                          </button>
                        </div>
                        {stock !== null && (
                          <small className="stock-hint">
                            Stock disponible: {stock}
                          </small>
                        )}
                      </div>

                      {/* Total por producto */}
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
                );
              })}
            </div>

            {/* Resumen del carrito */}
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
                  onClick={() => navigate("/checkout")}
                >
                  Proceder al pago
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
