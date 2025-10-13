// ✅ src/components/ProductList/ProductList.jsx
import { useState } from 'react';
import ProductCard from '../ProductCard';
import { Grid, List, PackageX } from 'lucide-react';
import './ProductList.css';
import { useProducts } from "../../hooks/useProducts"; // <-- NUEVO IMPORT

const ProductList = ({ viewMode = 'grid' }) => {
  const [currentView, setCurrentView] = useState(viewMode);
  const { products, loading } = useProducts(); // <-- SE USA EL HOOK

  if (loading) {
    return <p className="loading-text">Cargando productos...</p>;
  }

  // Si no hay productos
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <PackageX size={64} className="no-products-icon" />
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar los filtros o realiza otra búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      {/* Header con contador y vista toggle */}
      <div className="product-list-header">
        <div className="results-count">
          <span className="count-number">{products.length}</span>
          <span className="count-text">
            {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </span>
        </div>

        <div className="view-toggle">
          <button
            className={`view-btn ${currentView === 'grid' ? 'active' : ''}`}
            onClick={() => setCurrentView('grid')}
            aria-label="Vista en cuadrícula"
          >
            <Grid size={20} />
          </button>
          <button
            className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
            aria-label="Vista en lista"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Grid de productos */}
        <div className={`product-grid ${currentView === 'list' ? 'list-view' : ''}`}>
        {products.map((product, index) => (
            <div
            key={product.id || `product-${index}`}
            className="product-item"
            style={{ animationDelay: `${index * 0.05}s` }}
            >
            <ProductCard product={product} />
            </div>
        ))}
        </div>
    </div>
  );
};

export default ProductList;
