import { useCart } from "../../context/CartContext";

export default function CartPreview() {
    const { cartItems, total } = useCart();

    return (
        <div className="cart-preview">
        <h3>Carrito de Compras</h3>
        {cartItems.length === 0 ? (
            <p>Tu carrito está vacío</p>
        ) : (
            <>
            {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} width="50" />
                <div>
                    <p>{item.name}</p>
                    <p>S/ {item.price.toFixed(2)}</p>
                </div>
                </div>
            ))}
            <hr />
            <p><strong>Total:</strong> S/ {total.toFixed(2)}</p>
            <button>Ver Carrito Completo</button>
            </>
        )}
        </div>
    );
}
