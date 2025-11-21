// src/pages/Checkout.jsx
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShoppingBag, FileText, ArrowRight, Package, ArrowLeft } from "lucide-react";
import "./Checkout.css";

export default function Checkout() {
  const { cartItems, total } = useCart();
  const navigate = useNavigate();

  const subtotal = total / 1.18;
  const igv = total - subtotal;
  const today = new Date().toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <>
      <Navbar />

      <main className="ck-page">
        <div className="ck-container">
          {/* Header con navegación */}
          <nav className="ck-nav">
            <button className="ck-nav__back" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} />
              <span>Volver</span>
            </button>
          </nav>

          {cartItems.length === 0 ? (
            /* Estado vacío */
            <section className="ck-empty">
              <div className="ck-empty__icon">
                <ShoppingBag size={56} strokeWidth={1.5} />
              </div>
              <h2 className="ck-empty__title">Tu carrito está vacío</h2>
              <p className="ck-empty__text">
                Agrega productos para continuar con tu compra
              </p>
              <button className="ck-empty__btn" onClick={() => navigate("/")}>
                Explorar productos
              </button>
            </section>
          ) : (
            /* Documento tipo factura/boleta */
            <article className="ck-invoice">
              {/* Encabezado del documento */}
              <header className="ck-invoice__header">
                <div className="ck-invoice__brand">
                  <FileText size={32} strokeWidth={1.5} />
                  <div>
                    <h1 className="ck-invoice__title">Resumen de Compra</h1>
                    <p className="ck-invoice__subtitle">Pre-visualización de orden</p>
                  </div>
                </div>
                <div className="ck-invoice__meta">
                  <div className="ck-invoice__meta-item">
                    <span className="ck-invoice__label">Fecha</span>
                    <span className="ck-invoice__value">{today}</span>
                  </div>
                  <div className="ck-invoice__meta-item">
                    <span className="ck-invoice__label">Items</span>
                    <span className="ck-invoice__value">{cartItems.length}</span>
                  </div>
                </div>
              </header>

              {/* Separador */}
              <div className="ck-invoice__divider"></div>

              {/* Tabla de productos */}
              <section className="ck-invoice__body">
                <table className="ck-table">
                  <thead className="ck-table__head">
                    <tr>
                      <th className="ck-table__th ck-table__th--product">Producto</th>
                      <th className="ck-table__th ck-table__th--qty">Cant.</th>
                      <th className="ck-table__th ck-table__th--price">P. Unit.</th>
                      <th className="ck-table__th ck-table__th--total">Importe</th>
                    </tr>
                  </thead>
                  <tbody className="ck-table__body">
                    {cartItems.map((item, ) => (
                      <tr key={item.id} className="ck-table__row">
                        <td className="ck-table__td ck-table__td--product">
                          <div className="ck-product">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="ck-product__img"
                              />
                            ) : (
                              <div className="ck-product__placeholder">
                                <Package size={20} />
                              </div>
                            )}
                            <div className="ck-product__info">
                              <span className="ck-product__name">{item.name}</span>
                              <span className="ck-product__id">SKU: {item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="ck-table__td ck-table__td--qty">
                          {item.quantity}
                        </td>
                        <td className="ck-table__td ck-table__td--price">
                          S/ {item.price.toFixed(2)}
                        </td>
                        <td className="ck-table__td ck-table__td--total">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* Separador */}
              <div className="ck-invoice__divider"></div>

              {/* Resumen de totales */}
              <footer className="ck-invoice__footer">
                <div className="ck-summary">
                  <div className="ck-summary__row">
                    <span className="ck-summary__label">Subtotal (sin IGV)</span>
                    <span className="ck-summary__value">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="ck-summary__row">
                    <span className="ck-summary__label">IGV (18%)</span>
                    <span className="ck-summary__value">S/ {igv.toFixed(2)}</span>
                  </div>
                  <div className="ck-summary__row ck-summary__row--total">
                    <span className="ck-summary__label">Total a Pagar</span>
                    <span className="ck-summary__total">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Nota legal */}
                <p className="ck-invoice__note">
                  * Los precios incluyen IGV. Este documento es una pre-visualización 
                  y no constituye comprobante de pago.
                </p>

                {/* Botón de acción */}
                <button 
                  className="ck-invoice__btn"
                  onClick={() => navigate("/payment")}
                >
                  <span>Proceder al Pago</span>
                  <ArrowRight size={20} />
                </button>
              </footer>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}