import CartNavbar from "../../components/NavbarCart/CartNavbar";
import { useCart } from "../../context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import "./CartPage.css";

export default function CartPage() {
  const { cartItems, total, removeFromCart, clearCart, updateQuantity } = useCart();

  const igv = total * 0.18;
  const subtotal = total - igv;

  const handleIncrease = (itemId, currentQty) => updateQuantity(itemId, currentQty + 1);
  const handleDecrease = (itemId, currentQty) => {
    if (currentQty > 1) updateQuantity(itemId, currentQty - 1);
  };

  return (
    <>
      {/* 🧭 Navbar exclusivo para la página del carrito */}
      <CartNavbar />

      <div className="cart-page">
        <h1>Carrito de Compras</h1>
        {cartItems.length === 0 ? (
          <p className="empty-cart">Tu carrito está vacío.</p>
        ) : (
          <div className="cart-container">
            <div className="cart-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="cart-img" />
                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    {item.brand && <p className="cart-brand">{item.brand}</p>}
                    <p>S/ {item.price.toFixed(2)}</p>
                  </div>

                  <div className="cart-controls">
                    <div className="quantity-controls">
                      <button
                        className="btn-qty"
                        onClick={() => handleDecrease(item.id, item.quantity)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        className="btn-qty"
                        onClick={() => handleIncrease(item.id, item.quantity)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      className="btn-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <p>Subtotal: <span>S/ {subtotal.toFixed(2)}</span></p>
              <p>IGV (18%): <span>S/ {igv.toFixed(2)}</span></p>
              <hr />
              <h3>Total: <span>S/ {total.toFixed(2)}</span></h3>

              <div className="cart-actions">
                <button className="btn-clear" onClick={clearCart}>
                  Vaciar carrito
                </button>
                <button className="btn-checkout">Proceder al pago</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
