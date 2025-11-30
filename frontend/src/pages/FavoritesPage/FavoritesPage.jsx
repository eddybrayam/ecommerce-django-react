// src/pages/FavoritesPage/FavoritesPage.jsx
import { useFavorites } from "../../context/FavoritesContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import Navbar from "../../components/Navbar/Navbar";         // 🟡 Añadido
import Footer from "../../components/Footer/Footer";         // 🟡 Añadido
import { Link } from "react-router-dom";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  return (
    <>
      {/* Navbar */}
      <Navbar />   {/* 🟡 importado */}

      <div className="favorites-page-wrapper">
        {favorites.length === 0 ? (
          <div className="favorites-page favorites-empty">
            <div className="favorites-empty-box">
              <h1>Mis Favoritos</h1>
              <p>No tienes productos en favoritos todavía.</p>
              <p className="favorites-empty-sub">
                Explora nuestro catálogo y guarda los productos que más te gusten.
              </p>

              <Link to="/" className="btn-primary favorites-back-btn">
                Ir a la tienda
              </Link>
            </div>
          </div>
        ) : (
          <div className="favorites-page">
            <div className="favorites-header">
              <div>
                <h1>Mis Favoritos</h1>
                <p className="favorites-subtitle">
                  Estos son los productos que guardaste para ver más tarde.
                </p>
              </div>
              <span className="favorites-count">
                {favorites.length} producto{favorites.length !== 1 && "s"}
              </span>
            </div>

            <div className="favorites-grid">
              {favorites.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />   {/* 🟡 importado */}
    </>
  );
};

export default FavoritesPage;
