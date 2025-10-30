// src/pages/ProductDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import Stars from "../../components/Stars";
import { getProductReviews, createOrUpdateReview, deleteMyReview } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ReviewComments from "../../components/ReviewComments";
import Agotado from "../../components/Agotado/Agotado"; // 🟢 AGREGADO
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
  const [cantidad, setCantidad] = useState(1); // 🟢 AGREGADO

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/products/${id}/`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();

        let extraImgs = [];
        try {
          extraImgs = JSON.parse(data.imagenes || "[]");
        } catch {
          extraImgs = [];
        }

        setProduct({ ...data, imagenes: extraImgs });
        setSelectedImage(
          data.imagen_principal ||
            data.imagen_url ||
            (extraImgs.length > 0 ? extraImgs[0] : "")
        );
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getProductReviews(id);
        setReviews(data || []);
        const mine = (data || []).find(r => r.usuario === user?.id);
        if (mine) {
          setMyRating(mine.calificacion);
          setMyComment(mine.comentario || "");
        }
      } catch (e) {
        console.error("Error cargando reseñas:", e);
      }
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
        const filtered = all.filter(
          (p) =>
            p.categoria_id === product.categoria_id &&
            p.producto_id !== product.producto_id
        );
        setRelated(filtered.slice(0, 6));
      } catch (error) {
        console.error("Error cargando relacionados:", error);
      }
    };
    fetchRelated();
  }, [product]);

  const ratingAvg = useMemo(
    () => Number(product?.rating_avg ?? 0) || 0,
    [product]
  );
  const ratingCount = useMemo(
    () => Number(product?.rating_count ?? 0) || 0,
    [product]
  );

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
    } catch (err) {
      console.error("Error guardando reseña:", err);
    } finally {
      setSubmitting(false);
    }
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
    } catch (err) {
      console.error("Error borrando reseña:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-center">
          <div className="loading-spinner"></div>
          <p>Cargando producto...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-detail-empty">
          <p>Producto no encontrado</p>
          <button onClick={() => navigate(-1)}>Volver</button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="product-detail-page">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} /> Volver
        </button>

        <div className="product-main">
          <div
            className="product-gallery"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <img src={selectedImage} alt={product.nombre} className="main-image" />

            <div className="thumbnail-row">
              {[product.imagen_principal, product.imagen_url, ...(product.imagenes || [])]
                .filter(Boolean)
                .map((img, i) => (
                  <img
                    key={i}
                    src={img.startsWith("http") ? img : `http://127.0.0.1:8000${img}`}
                    alt={`Imagen ${i + 1}`}
                    className={`thumb ${img === selectedImage ? "active" : ""}`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
            </div>
          </div>

          <div className="product-info">
            <h2>{product.nombre}</h2>

            <div className="rating">
              <Stars value={ratingAvg} />
              <span className="rating-value">{Number(ratingAvg || 0).toFixed(1)} / 5</span>
              <span className="rating-count">
                {ratingCount > 0 ? `(${ratingCount} reseñas)` : "(0 reseñas)"}
              </span>
            </div>

            <h3 className="price">S/ {parseFloat(product.precio).toFixed(2)}</h3>
            <p className="description">{product.descripcion}</p>

            {/* 🟢 Mostrar aviso de stock */}
            <Agotado stock={product.stock} cantidad={cantidad} />

            {/* 🟢 Selector de cantidad */}
            <div className="quantity-selector">
              <label>Cantidad:</label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              />
            </div>

            <div className="action-buttons">
              <button
                className={`add-cart-btn ${added ? "added" : ""}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added ? (
                  <>
                    <Check size={22} /> Agregado
                  </>
                ) : (
                  <>
                    <ShoppingCart size={22} /> Agregar al carrito
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* resto de tu código sin cambios */}
        <div className="reviews-section">
          <h3>Reseñas de clientes</h3>

          {reviews.length === 0 ? (
            <p className="no-reviews">No hay reseñas aún. ¡Sé el primero en opinar!</p>
          ) : (
            <ul className="reviews-list">
              {reviews.map((r) => (
                <li key={r.id} className="review-item">
                  <div className="review-header">
                    <strong>{r.usuario_nombre || `Usuario #${r.usuario}`}</strong>
                    <span className="review-date">
                      {new Date(r.creado_en).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="review-stars">
                    <Stars value={r.calificacion} showNumber={false} size={20} />
                  </div>
                  {r.comentario && <p className="review-comment">{r.comentario}</p>}
                  <ReviewComments productId={id} reviewId={r.id} canComment={!!user} />
                </li>
              ))}
            </ul>
          )}

          {!user ? (
            <div className="login-hint">
              <p>
                Inicia sesión para dejar tu reseña.{" "}
                <Link to="/login">Ir a iniciar sesión</Link>
              </p>
            </div>
          ) : (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <h4>{reviews.some(r => r.usuario === user?.id) ? "Editar mi reseña" : "Escribir una reseña"}</h4>

              <label>Calificación</label>
              <select
                value={myRating}
                onChange={(e) => setMyRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>{v} estrellas</option>
                ))}
              </select>

              <label>Comentario (opcional)</label>
              <textarea
                rows={5}
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
                placeholder="¿Qué te pareció este producto?"
              />

              <div className="review-actions">
                <button type="submit" disabled={submitting}>
                  {submitting ? "Guardando..." : "Guardar reseña"}
                </button>

                {reviews.some(r => r.usuario === user?.id) && (
                  <button
                    type="button"
                    className="danger"
                    onClick={handleDeleteMyReview}
                  >
                    Eliminar mi reseña
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {related.length > 0 && (
          <div className="related-section">
            <h3>Productos similares</h3>
            <div className="related-carousel">
              {related.map((item) => (
                <Link
                  key={item.producto_id}
                  to={`/product/${item.producto_id}`}
                  className="related-card"
                >
                  <img src={item.imagen_url} alt={item.nombre} />
                  <p>{item.nombre}</p>
                  <span>S/ {parseFloat(item.precio).toFixed(2)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}