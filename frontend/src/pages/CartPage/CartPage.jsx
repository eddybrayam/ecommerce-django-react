import { useCart } from "../../context/CartContext";
import { Trash2 } from "lucide-react";
import "./CartPage.css";  


export default function CartPage() {
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
                <button className="btn-checkout">Proceder al pago</button>
                </div>
            </div>
            </>
        )}
        </div>
    );
}
