import { useEffect, useState } from "react";
import { getMyOrders } from "../../../api/orders";
import OrderStatusBadge from "../../../components/OrderStatusBadge";
import "./styles.css";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => { getMyOrders().then(r => setOrders(r.data)); }, []);

    return (
        <div className="orders-page">
        <h2>Mis Pedidos</h2>
        {orders.length === 0 ? (
            <p>No tienes pedidos aún.</p>
        ) : (
            <div className="orders-list">
            {orders.map(o => (
                <div key={o.id} className="order-card">
                <div className="order-head">
                    <strong>Pedido #{o.id}</strong>
                    <OrderStatusBadge status={o.status} />
                </div>
                <div className="order-meta">
                    <span>{new Date(o.created_at).toLocaleString()}</span>
                    <span>Total: S/ {Number(o.total).toFixed(2)}</span>
                </div>
                <div className="items">
                    {o.items?.map(it => (
                    <div key={it.id} className="item-row">
                        <span>{it.product_name}</span>
                        <span>x{it.quantity}</span>
                        <span>S/ {Number(it.price).toFixed(2)}</span>
                    </div>
                    ))}
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}
