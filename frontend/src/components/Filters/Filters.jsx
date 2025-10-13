import { useState, useEffect } from 'react';
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    Laptop,
    Smartphone,
    Tablet,
    Headphones,
    Gamepad2,
    Heart,
    Package
} from 'lucide-react';
import './Filters.css';

const Filters = ({ onFilterChange, onSearch, onSort }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [sortBy, setSortBy] = useState('featured');
    const [showFilters, setShowFilters] = useState(false);

    // ✅ NUEVO: estados para marcas
    const [marcas, setMarcas] = useState([]);
    const [selectedMarca, setSelectedMarca] = useState('');

    const API_URL = 'http://127.0.0.1:8000/api'; // cambia si tu backend usa otro puerto

    const categories = [
        { id: 'all', name: 'Todas', icon: SlidersHorizontal },
        { id: 'laptops', name: 'Laptops', icon: Laptop },
        { id: 'celulares', name: 'Celulares', icon: Smartphone },
        { id: 'tablets', name: 'Tablets', icon: Tablet },
        { id: 'accesorios', name: 'Accesorios', icon: Headphones },
        { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
        { id: 'smartwatch', name: 'Smartwatches', icon: Heart },
        { id: 'marca', name: 'Marca', icon: Package }
    ];

    const sortOptions = [
        { value: 'featured', label: 'Destacados' },
        { value: 'price-asc', label: 'Precio: Menor a Mayor' },
        { value: 'price-desc', label: 'Precio: Mayor a Menor' },
        { value: 'name-asc', label: 'Nombre: A-Z' },
        { value: 'name-desc', label: 'Nombre: Z-A' },
        { value: 'newest', label: 'Más Recientes' },
        { value: 'rating', label: 'Mejor Valorados' }
    ];

    // ✅ NUEVO: obtener marcas desde el backend
    useEffect(() => {
        fetch(`${API_URL}/marcas/`)
            .then((res) => res.json())
            .then((data) => setMarcas(data))
            .catch((err) => console.error('Error al cargar marcas:', err));
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (onFilterChange) {
            onFilterChange({ category: categoryId, priceRange, marca: selectedMarca });
        }
    };

    const handlePriceChange = (index, value) => {
        const newRange = [...priceRange];
        newRange[index] = Number(value);
        setPriceRange(newRange);
        if (onFilterChange) {
            onFilterChange({ category: selectedCategory, priceRange: newRange, marca: selectedMarca });
        }
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        if (onSort) {
            onSort(value);
        }
    };

    // ✅ NUEVO: manejar filtro por marca
    const handleMarcaChange = (e) => {
        const value = e.target.value;
        setSelectedMarca(value);
        if (onFilterChange) {
            onFilterChange({ category: selectedCategory, priceRange, marca: value });
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setPriceRange([0, 10000]);
        setSortBy('featured');
        setSelectedMarca('');
        if (onFilterChange) {
            onFilterChange({ category: 'all', priceRange: [0, 10000], marca: '' });
        }
        if (onSearch) {
            onSearch('');
        }
        if (onSort) {
            onSort('featured');
        }
    };

    const hasActiveFilters = 
        selectedCategory !== 'all' || 
        priceRange[0] > 0 || 
        priceRange[1] < 10000 ||
        searchTerm !== '' ||
        selectedMarca !== '';

    return (
        <div className="filters-container">
        {/* Barra de búsqueda y controles principales */}
        <div className="filters-header">
            <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input-filters"
            />
            {searchTerm && (
                <button 
                className="clear-search"
                onClick={() => {
                    setSearchTerm('');
                    if (onSearch) onSearch('');
                }}
                >
                <X size={18} />
                </button>
            )}
            </div>

            <div className="filter-controls">
            <button 
                className={`filters-toggle ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
            >
                <SlidersHorizontal size={20} />
                <span>Filtros</span>
                {hasActiveFilters && <span className="filter-badge"></span>}
            </button>

            <div className="sort-dropdown">
                <select 
                value={sortBy} 
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
                >
                {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
                ))}
                </select>
                <ChevronDown className="dropdown-icon" size={18} />
            </div>
            </div>
        </div>

        {/* Panel de filtros expandible */}
        <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
            {/* Categorías */}
            <div className="filter-section">
            <h3 className="filter-title">Categorías</h3>
            <div className="categories-grid">
                {categories.map(category => {
                const IconComponent = category.icon;
                return (
                    <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.id)}
                    >
                    <IconComponent size={20} />
                    <span>{category.name}</span>
                    </button>
                );
                })}
            </div>
            </div>

            {/* ✅ NUEVO: Filtro por Marca */}
            <div className="filter-section">
                <h3 className="filter-title">Marca</h3>
                <select
                    value={selectedMarca}
                    onChange={handleMarcaChange}
                    className="brand-select"
                >
                    <option value="">Todas</option>
                    {marcas.map((marca) => (
                        <option key={marca.id} value={marca.id}>
                            {marca.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Rango de precio */}
            <div className="filter-section">
            <h3 className="filter-title">Rango de Precio</h3>
            <div className="price-range">
                <div className="price-inputs">
                <div className="price-input-group">
                    <label>Mínimo</label>
                    <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    className="price-input"
                    />
                    <span className="currency">S/</span>
                </div>
                <div className="price-separator">-</div>
                <div className="price-input-group">
                    <label>Máximo</label>
                    <input
                    type="number"
                    min={priceRange[0]}
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="price-input"
                    />
                    <span className="currency">S/</span>
                </div>
                </div>
                
                <div className="range-slider">
                <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    className="range-input range-min"
                />
                <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="range-input range-max"
                />
                <div className="range-track"></div>
                </div>
            </div>
            </div>

            {/* Botón limpiar filtros */}
            {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
                <X size={18} />
                <span>Limpiar Filtros</span>
            </button>
            )}
        </div>
        </div>
    );
};

export default Filters;
