// src/pages/ProductDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Check, Star, Package, Truck } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import Stars from "../../components/Stars";
import { getProductReviews, createOrUpdateReview, deleteMyReview } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ReviewComments from "../../components/ReviewComments";
import Agotado from "../../components/Agotado/Agotado";
import "./ProductDetail.css";

const API = "http://127.0.0.1:8000/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, token } = useAuth?.() || {};

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/products/${id}/`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        let extraImgs = [];
        try { extraImgs = JSON.parse(data.imagenes || "[]"); } catch { extraImgs = []; }
        setProduct({ ...data, imagenes: extraImgs });
        setSelectedImage(data.imagen_principal || data.imagen_url || (extraImgs.length > 0 ? extraImgs[0] : ""));
      } catch (err) { console.error(err); setProduct(null); }
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getProductReviews(id);
        setReviews(data || []);
        const mine = (data || []).find(r => r.usuario === user?.id);
        if (mine) { setMyRating(mine.calificacion); setMyComment(mine.comentario || ""); }
      } catch (e) { console.error("Error cargando reseñas:", e); }
    };
    if (id) loadReviews();
  }, [id, user?.id]);

  useEffect(() => {
    if (!product?.imagenes || product.imagenes.length === 0) return;
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (isPaused) return;
      const allImages = [product.imagen_url, ...(product.imagenes || [])].filter(Boolean);
      if (allImages.length === 0) return;
      currentIndex = (currentIndex + 1) % allImages.length;
      setSelectedImage(allImages[currentIndex]);
    }, 5000);
    return () => clearInterval(interval);
  }, [product, isPaused]);

  useEffect(() => {
    if (!product?.categoria_id) return;
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API}/products/`);
        const all = await res.json();
        const filtered = all.filter(p => p.categoria_id === product.categoria_id && p.producto_id !== product.producto_id);
        setRelated(filtered.slice(0, 6));
      } catch (error) { console.error("Error cargando relacionados:", error); }
    };
    fetchRelated();
  }, [product]);

  const ratingAvg = useMemo(() => Number(product?.rating_avg ?? 0) || 0, [product]);
  const ratingCount = useMemo(() => Number(product?.rating_count ?? 0) || 0, [product]);

  const handleAddToCart = () => {
  if (cantidad > product.stock) {
    alert(`Solo hay ${product.stock} unidades disponibles.`);
    return;
  }

  const formatted = {
    id: product.producto_id,
    name: product.nombre,
    price: parseFloat(product.precio),
    image: selectedImage,
    description: product.descripcion,
    quantity: cantidad,
    stock: product.stock,          // 🔹 NUEVO
  };

  addToCart(formatted);
  setAdded(true);
  setTimeout(() => setAdded(false), 1500);
};


  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const access = token || localStorage.getItem("access");
      if (!access) { console.error("Sin token. Inicia sesión."); return; }
      await createOrUpdateReview(id, { calificacion: myRating, comentario: myComment }, access);
      const data = await getProductReviews(id);
      setReviews(data || []);
      const res = await fetch(`${API}/products/${id}/`);
      const prod = await res.json();
      setProduct(prod);
    } catch (err) { console.error("Error guardando reseña:", err); }
    finally { setSubmitting(false); }
  };

  const handleDeleteMyReview = async () => {
    try {
      const access = token || localStorage.getItem("access");
      if (!access) { console.error("Sin token. Inicia sesión."); return; }
      await deleteMyReview(id, access);
      const data = await getProductReviews(id);
      setReviews(data || []);
      setMyRating(5);
      setMyComment("");
      const res = await fetch(`${API}/products/${id}/`);
      const prod = await res.json();
      setProduct(prod);
    } catch (err) { console.error("Error borrando reseña:", err); }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pd-loading">
          <div className="pd-loading__spinner"></div>
          <p className="pd-loading__text">Cargando producto...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pd-empty">
          <div className="pd-empty__content">
            <Package size={64} strokeWidth={1.5} />
            <h2 className="pd-empty__title">Producto no encontrado</h2>
            <p className="pd-empty__text">El producto que buscas no existe o fue eliminado.</p>
            <button className="pd-empty__btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Volver atrás
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="pd-container">
        {/* Breadcrumb / Back */}
        <nav className="pd-nav">
          <button className="pd-nav__back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
        </nav>

        {/* Product Section */}
        <section className="pd-product">
          {/* Gallery */}
          <div className="pd-gallery" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <figure className="pd-gallery__main">
              <img src={selectedImage} alt={product.nombre} className="pd-gallery__image" />
            </figure>

            <div className="pd-gallery__thumbs">
              {[product.imagen_principal, product.imagen_url, ...(product.imagenes || [])]
                .filter(Boolean)
                .map((img, i) => (
                  <button
                    key={i}
                    className={`pd-gallery__thumb ${img === selectedImage ? "pd-gallery__thumb--active" : ""}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img.startsWith("http") ? img : `http://127.0.0.1:8000${img}`} alt={`Vista ${i + 1}`} />
                  </button>
                ))}
            </div>
          </div>

          {/* Info */}
          <article className="pd-info">
            <header className="pd-info__header">
              <h1 className="pd-info__title">{product.nombre}</h1>
              
              <div className="pd-info__rating">
                <Stars value={ratingAvg} />
                <span className="pd-info__rating-value">{Number(ratingAvg || 0).toFixed(1)}</span>
                <span className="pd-info__rating-count">({ratingCount} reseñas)</span>
              </div>
            </header>

            <div className="pd-info__price-box">
              <span className="pd-info__price">S/ {parseFloat(product.precio).toFixed(2)}</span>
            </div>

            <p className="pd-info__description">{product.descripcion}</p>

            {/* Stock Status */}
            <Agotado stock={product.stock} cantidad={cantidad} />

            {/* Purchase Controls */}
            <div className="pd-purchase">
              <div className="pd-purchase__quantity">
                <label className="pd-purchase__label" htmlFor="cantidad">Cantidad</label>
                <div className="pd-purchase__input-wrap">
                  <button 
                    className="pd-purchase__qty-btn" 
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    disabled={cantidad <= 1}
                  >−</button>
                  <input
                    id="cantidad"
                    type="number"
                    className="pd-purchase__input"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                  />
                  <button 
                    className="pd-purchase__qty-btn" 
                    onClick={() => setCantidad(cantidad + 1)}
                    disabled={cantidad >= product.stock}
                  >+</button>
                </div>
              </div>

              <button
                className={`pd-purchase__cart-btn ${added ? "pd-purchase__cart-btn--added" : ""}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added ? (
                  <><Check size={20} /> Agregado</>
                ) : (
                  <><ShoppingCart size={20} /> Agregar al carrito</>
                )}
              </button>
            </div>

            {/* Shipping Info */}
            <div className="pd-shipping">
              <div className="pd-shipping__item">
                <Truck size={20} />
                <span>Envío a todo el país</span>
              </div>
              <div className="pd-shipping__item">
                <Package size={20} />
                <span>Stock disponible: {product.stock} unidades</span>
              </div>
            </div>
          </article>
        </section>

        {/* Reviews Section */}
        <section className="pd-reviews">
          <header className="pd-reviews__header">
            <h2 className="pd-reviews__title">Reseñas de clientes</h2>
            <div className="pd-reviews__summary">
              <span className="pd-reviews__avg">{Number(ratingAvg || 0).toFixed(1)}</span>
              <Stars value={ratingAvg} />
              <span className="pd-reviews__total">{ratingCount} reseñas</span>
            </div>
          </header>

          {reviews.length === 0 ? (
            <div className="pd-reviews__empty">
              <Star size={48} strokeWidth={1.5} />
              <p>No hay reseñas aún. ¡Sé el primero en opinar!</p>
            </div>
          ) : (
            <ul className="pd-reviews__list">
              {reviews.map((r) => (
                <li key={r.id} className="pd-review">
                  <header className="pd-review__header">
                    <div className="pd-review__user">
                      <div className="pd-review__avatar">
                        {(r.usuario_nombre || "U")[0].toUpperCase()}
                      </div>
                      <div className="pd-review__meta">
                        <strong className="pd-review__name">{r.usuario_nombre || `Usuario #${r.usuario}`}</strong>
                        <time className="pd-review__date">{new Date(r.creado_en).toLocaleDateString()}</time>
                      </div>
                    </div>
                    <div className="pd-review__stars">
                      <Stars value={r.calificacion} showNumber={false} size={18} />
                    </div>
                  </header>
                  {r.comentario && <p className="pd-review__comment">{r.comentario}</p>}
                  <ReviewComments productId={id} reviewId={r.id} canComment={!!user} />
                </li>
              ))}
            </ul>
          )}

          {/* Review Form */}
          {!user ? (
            <div className="pd-reviews__login">
              <p>¿Ya probaste este producto? <Link to="/login">Inicia sesión</Link> para dejar tu reseña.</p>
            </div>
          ) : (
            <form className="pd-review-form" onSubmit={handleSubmitReview}>
              <h3 className="pd-review-form__title">
                {reviews.some(r => r.usuario === user?.id) ? "Editar mi reseña" : "Escribir una reseña"}
              </h3>

              <div className="pd-review-form__field">
                <label className="pd-review-form__label">Tu calificación</label>
                <select
                  className="pd-review-form__select"
                  value={myRating}
                  onChange={(e) => setMyRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((v) => (
                    <option key={v} value={v}>{v} {v === 1 ? "estrella" : "estrellas"}</option>
                  ))}
                </select>
              </div>

              <div className="pd-review-form__field">
                <label className="pd-review-form__label">Tu comentario <span>(opcional)</span></label>
                <textarea
                  className="pd-review-form__textarea"
                  rows={4}
                  value={myComment}
                  onChange={(e) => setMyComment(e.target.value)}
                  placeholder="Cuéntanos tu experiencia con este producto..."
                />
              </div>

              <div className="pd-review-form__actions">
                <button type="submit" className="pd-review-form__submit" disabled={submitting}>
                  {submitting ? "Guardando..." : "Publicar reseña"}
                </button>

                {reviews.some(r => r.usuario === user?.id) && (
                  <button type="button" className="pd-review-form__delete" onClick={handleDeleteMyReview}>
                    Eliminar mi reseña
                  </button>
                )}
              </div>
            </form>
          )}
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="pd-related">
            <h2 className="pd-related__title">Productos similares</h2>
            <div className="pd-related__grid">
              {related.map((item) => (
                <Link key={item.producto_id} to={`/product/${item.producto_id}`} className="pd-related__card">
                  <figure className="pd-related__image">
                    <img src={item.imagen_url} alt={item.nombre} />
                  </figure>
                  <div className="pd-related__info">
                    <h3 className="pd-related__name">{item.nombre}</h3>
                    <span className="pd-related__price">S/ {parseFloat(item.precio).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}