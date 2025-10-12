import { useState } from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import './ProductCard.css';
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart } = useCart();

    // 🧠 Normalize product fields from backend
    const normalizedProduct = {
        id: product.id,
        name: product.name || product.nombre || "Unnamed product",
        price: Number(product.price || product.precio || 0),
        oldPrice: Number(product.oldPrice || product.precio_anterior || 0),
        image: product.image || product.imagen || product.imagen_url || "/placeholder-product.jpg",
        category: product.category || product.categoria || "Sin categoría",
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        badge: product.badge || "",
        discount: product.discount || 0,
        inStock: product.inStock ?? true,
    };

    // Destructure normalized values
    const { id, name, price, oldPrice, image, category, rating, reviews, badge, discount, inStock } =
        normalizedProduct;

    const handleAddToCart = async () => {
        if (!inStock) return;
        setIsAdding(true);
        await addToCart(normalizedProduct);
        setTimeout(() => setIsAdding(false), 800);
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(<Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />);
        } else if (i === fullStars && hasHalfStar) {
            stars.push(<Star key={i} size={14} fill="url(#half)" color="#f59e0b" />);
        } else {
            stars.push(<Star key={i} size={14} color="#d1d5db" />);
        }
        }
        return stars;
    };
    

    return (
        <div className={`product-card ${!inStock ? 'out-of-stock' : ''}`}>
        {/* Badges */}
        <div className="product-badges">
            {badge === 'new' && <span className="badge badge-new">Nuevo</span>}
            {badge === 'sale' && discount && (
            <span className="badge badge-sale">-{discount}%</span>
            )}
            {!inStock && <span className="badge badge-out">Agotado</span>}
        </div>

        {/* Imagen del producto */}
        <div className="product-image-container">
            {/* ✅ Imagen clickeable */}
            <Link to={`/product/${product.id}`} className="product-link">
                <img
                src={image || "/placeholder-product.jpg"}
                alt={name}
                className="product-image"
                loading="lazy"
                />
            </Link>

            {/* Acciones rápidas */}
            <div className="product-actions">
                <button
                className={`action-btn favorite-btn ${isFavorite ? "active" : ""}`}
                onClick={toggleFavorite}
                aria-label="Agregar a favoritos"
                >
                <Heart size={18} fill={isFavorite ? "#ef4444" : "none"} />
                </button>

                {/* 👁️ Vista rápida opcional — la dejamos sin acción de momento */}
                <button
                className="action-btn quick-view-btn"
                aria-label="Vista rápida"
                >
                <Eye size={18} />
                </button>
            </div>
        </div>

        {/* Información del producto */}
        <div className="product-info">
            {/* Categoría */}
            <span className="product-category">{category}</span>

            {/* Nombre */}
            <Link to={`/product/${product.id}`} className="product-link product-name-link">
                <h3 className="product-name">{name}</h3>
                </Link>


            {/* Rating */}
            <div className="product-rating">
            <div className="stars">
                <svg width="0" height="0">
                <defs>
                    <linearGradient id="half">
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#d1d5db" />
                    </linearGradient>
                </defs>
                </svg>
                {renderStars(rating)}
            </div>
            <span className="rating-text">
                {rating} {reviews > 0 && `(${reviews})`}
            </span>
            </div>

            {/* Precio */}
            <div className="product-price">
            <span className="current-price">S/ {price.toFixed(2)}</span>
            {oldPrice && (
                <span className="old-price">S/ {oldPrice.toFixed(2)}</span>
            )}
            </div>

            {/* Botón agregar al carrito */}
            <button 
            className={`add-to-cart-btn ${isAdding ? 'adding' : ''} ${!inStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!inStock}
            >
            {!inStock ? (
                'Agotado'
            ) : isAdding ? (
                'Agregado ✓'
            ) : (
                <>
                <ShoppingCart size={18} />
                <span>Agregar al Carrito</span>
                </>
            )}
            </button>
        </div>
        </div>
    );
};

export default ProductCard;