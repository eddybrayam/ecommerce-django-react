// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Star, Check, AlertTriangle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [quantity, setQuantity] = useState(1); // 👈 cantidad seleccionada
  const [warning, setWarning] = useState(""); // 👈 mensaje de advertencia

  // 🔹 1. Obtener producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/products/${id}/`);
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

  // 🔁 2. Rotar imágenes automáticamente cada 5s
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

  // 🔹 3. Productos relacionados
  useEffect(() => {
    if (!product?.categoria_id) return;
    const fetchRelated = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/products/`);
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

  // 🔸 Controlar cantidad y stock
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(value);

    if (value > product.stock) {
      setWarning(`⚠️ Solo quedan ${product.stock} unidades disponibles`);
    } else if (value <= 0) {
      setWarning("❗ Ingresa una cantidad válida");
    } else {
      setWarning("");
    }
  };

  // 🔸 Agregar al carrito con control de stock
  const handleAddToCart = () => {
    if (product.stock === 0) {
      setWarning("❌ Producto agotado");
      return;
    }
    if (quantity > product.stock) {
      setWarning(`⚠️ Solo hay ${product.stock} unidades en stock`);
      return;
    }

    const formatted = {
      id: product.producto_id,
      name: product.nombre,
      price: parseFloat(product.precio),
      image: selectedImage,
      description: product.descripcion,
      quantity: quantity,
    };

    addToCart(formatted);
    setAdded(true);
    setWarning("");
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-center">Cargando producto...</div>
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
          <ArrowLeft size={20} /> Volver
        </button>

        <div className="product-main">
          {/* 🔸 Galería */}
          <div
            className="product-gallery"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <img src={selectedImage} alt={product.nombre} className="main-image" />

            {/* Miniaturas */}
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

          {/* 🔸 Información */}
          <div className="product-info">
            <h2>{product.nombre}</h2>

            <p className={`stock ${product.stock === 0 ? "out" : ""}`}>
              <strong>Stock:</strong>{" "}
              {product.stock > 0 ? product.stock : "Agotado"}
            </p>

            <div className="rating">
              <Star className="star" /> <span>4.5</span>{" "}
              <small>(23 reseñas)</small>
            </div>

            <h3 className="price">S/ {parseFloat(product.precio).toFixed(2)}</h3>
            <p className="description">{product.descripcion}</p>

            {/* 🔸 Cantidad */}
            <div className="quantity-section">
              <label htmlFor="quantity">Cantidad:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>

            {/* 🔸 Mensaje de advertencia */}
            {warning && (
              <div className="stock-warning">
                <AlertTriangle size={18} /> {warning}
              </div>
            )}

            {/* 🔸 Botón agregar */}
            <div className="action-buttons">
              <button
                className={`add-cart-btn ${added ? "added" : ""}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added ? (
                  <>
                    <Check size={18} /> Agregado
                  </>
                ) : product.stock === 0 ? (
                  <>
                    <AlertTriangle size={18} /> Agotado
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Agregar al carrito
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 🔹 Relacionados */}
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
