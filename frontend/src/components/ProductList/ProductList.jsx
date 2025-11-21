import { useState } from 'react';
import ProductCard from '../ProductCard';
import { Grid, List, PackageX } from 'lucide-react';
import './ProductList.css';

const ProductList = ({ products, viewMode = 'grid' }) => {
    // COMENTARIO: Lógica existente de manejo de vista, no se modifica.
    const [currentView, setCurrentView] = useState(viewMode);

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
        <div className="product-list-wrapper">
            
            {/* INICIO: Header de Resultados Moderno */}
            <div className="list-controls-header">
                
                {/* Contador de Resultados */}
                <h2 className="results-summary">
                    <span className="count-number">{products.length}</span>
                    <span className="count-text">
                        {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                    </span>
                </h2>

                {/* Botones de Cambio de Vista */}
                <div className="view-toggle-buttons">
                    <button
                        className={`view-btn ${currentView === 'grid' ? 'active' : ''}`}
                        onClick={() => setCurrentView('grid')}
                        aria-label="Vista en cuadrícula"
                        title="Mostrar en cuadrícula"
                    >
                        <Grid size={22} />
                    </button>
                    <button
                        className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
                        onClick={() => setCurrentView('list')}
                        aria-label="Vista en lista"
                        title="Mostrar en lista"
                    >
                        <List size={22} />
                    </button>
                </div>
            </div>
            {/* FIN: Header de Resultados Moderno */}

            {/* Contenedor de Productos: Aplicamos el modo de vista */}
            <div className={`product-results-grid ${currentView === 'list' ? 'list-view-enabled' : 'grid-view-enabled'}`}>
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="product-item-card"
                        style={{
                            // Lógica de animación mantenida
                            animationDelay: `${index * 0.05}s`
                        }}
                    >
                        {/* COMENTARIO: El componente hijo ProductCard se mantiene sin cambios */}
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;