import "./styles.css";
export default function OrderStatusBadge({ status }) {
  const map = { PENDIENTE:"Pendiente", ENVIADO:"Enviado", ENTREGADO:"Entregado" };
  return <span className={`badge ${status}`}>{map[status] || status}</span>;
}
