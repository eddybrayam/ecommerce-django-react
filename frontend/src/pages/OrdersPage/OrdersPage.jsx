// src/pages/OrdersPage.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/orders/mine/");
        setOrders(data);
      } catch (e) {
        setError(e?.response?.data?.error || "No se pudieron cargar tus pedidos");
        setOrders([]);
      }
    })();
  }, []);

  const getStatusStyle = (status) => {
    const styles = {
      PENDIENTE: {
        bg: "#fff3cd",
        color: "#856404",
        border: "#ffc107"
      },
      ENVIADO: {
        bg: "#d1ecf1",
        color: "#0c5460",
        border: "#17a2b8"
      },
      ENTREGADO: {
        bg: "#d4edda",
        color: "#155724",
        border: "#28a745"
      }
    };
    return styles[status] || styles.PENDIENTE;
  };

  const getStatusText = (status) => {
    return status === "PENDIENTE"
      ? "Pendiente"
      : status === "ENVIADO"
      ? "Enviado"
      : "Entregado";
  };

  return (
    <>
      <Navbar />

      <div style={{ 
        minHeight: "calc(100vh - 200px)",
        background: "linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)",
        padding: "3rem 1rem"
      }}>
        <div style={{ 
          maxWidth: "1000px", 
          margin: "0 auto"
        }}>
          {/* Header */}
          <div style={{
            marginBottom: "2.5rem",
            textAlign: "center"
          }}>
            <h1 style={{ 
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#333",
              margin: "0 0 0.5rem 0",
              letterSpacing: "-0.5px"
            }}>
              Mis Pedidos
            </h1>
            <p style={{
              fontSize: "1.05rem",
              color: "#666",
              margin: 0
            }}>
              Historial completo de tus compras
            </p>
          </div>

          {/* Loading State */}
          {orders === null && (
            <div style={{ 
              textAlign: "center", 
              padding: "3rem",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{
                width: "50px",
                height: "50px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #667eea",
                borderRadius: "50%",
                margin: "0 auto 1rem",
                animation: "spin 1s linear infinite"
              }}></div>
              <p style={{ 
                fontSize: "1.1rem",
                color: "#666",
                margin: 0
              }}>
                Cargando pedidos…
              </p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{ 
              padding: "1.5rem",
              background: "#fff5f5",
              border: "2px solid #feb2b2",
              borderRadius: "12px",
              color: "#c53030",
              fontSize: "1rem",
              textAlign: "center"
            }}>
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          {/* Empty State */}
          {Array.isArray(orders) && orders.length === 0 && !error && (
            <div style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <div style={{
                fontSize: "4rem",
                marginBottom: "1rem"
              }}>
                📦
              </div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#333",
                margin: "0 0 0.5rem 0"
              }}>
                No tienes pedidos aún
              </h3>
              <p style={{
                fontSize: "1rem",
                color: "#666",
                margin: 0
              }}>
                Cuando realices tu primera compra, aparecerá aquí
              </p>
            </div>
          )}

          {/* Orders List */}
          {Array.isArray(orders) && orders.length > 0 && (
            <div style={{ 
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}>
              {orders.map((o) => {
                const statusStyle = getStatusStyle(o.status);
                return (
                  <div
                    key={o.id}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      border: "1px solid #f0f0f0",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Order Header */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                      paddingBottom: "1rem",
                      borderBottom: "2px solid #f5f5f5",
                      flexWrap: "wrap",
                      gap: "0.5rem"
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: "1.3rem",
                          fontWeight: "700",
                          color: "#333",
                          margin: "0 0 0.25rem 0"
                        }}>
                          Pedido #{o.id}
                        </h3>
                        <p style={{
                          fontSize: "0.9rem",
                          color: "#888",
                          margin: 0
                        }}>
                          {new Date(o.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        border: `2px solid ${statusStyle.border}`,
                        borderRadius: "20px",
                        padding: "0.5rem 1.25rem",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        {getStatusText(o.status)}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div style={{
                      background: "#fafafa",
                      borderRadius: "10px",
                      padding: "1rem",
                      marginBottom: "1rem"
                    }}>
                      {o.items?.map((it, idx) => (
                        <div
                          key={it.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto auto",
                            gap: "1rem",
                            padding: "0.75rem 0",
                            borderTop: idx > 0 ? "1px solid #e5e5e5" : "none",
                            alignItems: "center"
                          }}
                        >
                          <span style={{
                            fontSize: "1rem",
                            color: "#333",
                            fontWeight: "500"
                          }}>
                            {it.product_name}
                          </span>
                          <span style={{
                            fontSize: "0.95rem",
                            color: "#666",
                            background: "white",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "6px",
                            fontWeight: "600"
                          }}>
                            x{it.quantity}
                          </span>
                          <span style={{
                            fontSize: "1rem",
                            color: "#667eea",
                            fontWeight: "700",
                            textAlign: "right",
                            minWidth: "90px"
                          }}>
                            S/ {Number(it.price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                      borderRadius: "10px"
                    }}>
                      <span style={{
                        fontSize: "1.1rem",
                        color: "#555",
                        fontWeight: "600"
                      }}>
                        Total del Pedido:
                      </span>
                      <span style={{
                        fontSize: "1.5rem",
                        color: "#667eea",
                        fontWeight: "700"
                      }}>
                        S/ {Number(o.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}