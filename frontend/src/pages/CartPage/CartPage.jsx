// src/pages/CartPage/CartPage.jsx
import { useCart } from "../../context/CartContext";
import { Trash2 } from "lucide-react";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const navigate = useNavigate();
    const { cartItems, total, removeFromCart, clearCart } = useCart();

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
                                    <p>S/ {item.price.toFixed(2)}</p>
                                </div>
                                <p className="cart-qty">x{item.quantity}</p>
                                <button
                                    className="btn-remove"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <p>
                            Subtotal: <span>S/ {subtotal.toFixed(2)}</span>
                        </p>
                        <p>
                            IGV (18%): <span>S/ {igv.toFixed(2)}</span>
                        </p>
                        <hr />
                        <h3>
                            Total: <span>S/ {total.toFixed(2)}</span>
                        </h3>

                        <div className="cart-actions">
                            <button className="btn-clear" onClick={clearCart}>
                                Vaciar carrito
                            </button>

                            {/* 🛒 Botón existente */}
                            <button
                                className="btn-checkout"
                                onClick={() => alert('Aquí iría la vista completa del carrito')}
                            >
                                Ver Carrito Completo
                            </button>

                            {/* 💳 NUEVO BOTÓN para ir al Checkout y aplicar cupón */}
                            <button
                                onClick={() => navigate("/checkout")}
                                className="btn-go-checkout"
                                style={{
                                    marginTop: "10px",
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                }}
                            >
                                Ir al Checkout / Aplicar Cupón 💳
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

