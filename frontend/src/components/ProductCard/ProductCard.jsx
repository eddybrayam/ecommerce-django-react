import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import './ProductCard.css';
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { Link } from "react-router-dom";
import Stars from "../Stars";

const ProductCard = ({ product }) => {
    const [isAdding, setIsAdding] = useState(false);

    const {
        name,
        price,
        oldPrice,
        image,
        category,
        rating = 4.5,
        reviews = 0,
        badge, 
        discount,
        inStock = true
    } = product;

    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    const handleAddToCart = () => {
        if (!inStock) return;
        setIsAdding(true);
        addToCart(product);
        setTimeout(() => setIsAdding(false), 800);
    };

    const handleToggleFavorite = () => {
        toggleFavorite(product);
    };

    const ratingAvg = product?.rating_avg ?? rating;
    const ratingCount = product?.rating_count ?? reviews;
    const favoriteActive = isFavorite(product.id);

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
                <Link to={`/product/${product.id}`} className="product-link">
                    <img
                        src={image || "/placeholder-product.jpg"}
                        alt={name}
                        className="product-image"
                        loading="lazy"
                    />
                </Link>

                {/* SOLO favorito (hemos quitado el ojo 👁️) */}
                <div className="product-actions">
                    <button
                        className={`action-btn favorite-btn ${favoriteActive ? "active" : ""}`}
                        onClick={handleToggleFavorite}
                        aria-label="Agregar a favoritos"
                    >
                        <Heart size={18} fill={favoriteActive ? "#ef4444" : "none"} />
                    </button>
                </div>
            </div>

            {/* Información del producto */}
            <div className="product-info">
                <span className="product-category">{category}</span>

                <Link to={`/product/${product.id}`} className="product-link product-name-link">
                    <h3 className="product-name">{name}</h3>
                </Link>

                <div className="product-rating">
                    <Stars value={Number(ratingAvg) || 0} />
                    <span className="rating-text">
                        {Number(ratingAvg || 0).toFixed(1)} {ratingCount > 0 && `(${ratingCount})`}
                    </span>
                </div>

                <div className="product-price">
                    <span className="current-price">S/ {price.toFixed(2)}</span>
                    {oldPrice && (
                        <span className="old-price">S/ {oldPrice.toFixed(2)}</span>
                    )}
                </div>

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
