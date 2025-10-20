import { useState, useEffect } from 'react';
import {
  Search, SlidersHorizontal, X, ChevronDown,
  Laptop, Smartphone, Tablet, Headphones, Gamepad2, Watch // puedes ajustar
} from 'lucide-react';
import './Filters.css';

const iconByKey = {
  laptops: Laptop,
  laptop: Laptop,
  notebooks: Laptop,
  celulares: Smartphone,
  smartphone: Smartphone,
  phones: Smartphone,
  tablets: Tablet,
  accesorios: Headphones,
  accesorios_tecnologia: Headphones,
  gaming: Gamepad2,
  smartwatch: Watch,
};

const pickIcon = (slugOrName) => {
  if (!slugOrName) return SlidersHorizontal;
  const key = String(slugOrName).toLowerCase().replaceAll(' ', '_');
  return iconByKey[key] || SlidersHorizontal;
};

const Filters = ({ onFilterChange, onSearch, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const [marcas, setMarcas] = useState([]);
  const [selectedMarca, setSelectedMarca] = useState('');

  // ✅ NUEVO: categorías desde backend
  const [categories, setCategories] = useState([{ id: 'all', name: 'Todas', slug: 'all' }]);

  const API_URL = 'http://127.0.0.1:8000/api'; // ajusta si corresponde

  useEffect(() => {
    // marcas
    fetch(`${API_URL}/marcas/`)
      .then((r) => r.json())
      .then(setMarcas)
      .catch((e) => console.error('Error al cargar marcas:', e));

    // categorías
    fetch(`${API_URL}/categorias/`)
    .then(r => r.json())
    .then(data => {
        const mapped = data.map(c => ({
        id: String(c.id),
        name: c.nombre,
        slug: (c.nombre || '').toLowerCase().replaceAll(' ', '-'),
        }));
        setCategories(prev => [prev[0], ...mapped]);
    })
      .catch((e) => console.error('Error al cargar categorías:', e));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    onFilterChange?.({ category: categoryId, priceRange, marca: selectedMarca });
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    setPriceRange(newRange);
    onFilterChange?.({ category: selectedCategory, priceRange: newRange, marca: selectedMarca });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSort?.(value);
  };

  const handleMarcaChange = (e) => {
    const value = e.target.value;
    setSelectedMarca(value);
    onFilterChange?.({ category: selectedCategory, priceRange, marca: value });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 10000]);
    setSortBy('featured');
    setSelectedMarca('');
    onFilterChange?.({ category: 'all', priceRange: [0, 10000], marca: '' });
    onSearch?.('');
    onSort?.('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000 ||
    searchTerm !== '' ||
    selectedMarca !== '';

  return (
    <div className="filters-container">
      {/* Header */}
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
              onClick={() => { setSearchTerm(''); onSearch?.(''); }}
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
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
              <option value="newest">Más Recientes</option>
              <option value="rating">Mejor Valorados</option>
            </select>
            <ChevronDown className="dropdown-icon" size={18} />
          </div>
        </div>
      </div>

      {/* Panel */}
      <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
        {/* Categorías */}
        <div className="filter-section">
          <h3 className="filter-title">Categorías</h3>
          <div className="categories-grid">
            {categories.map((category) => {
              const Icon = pickIcon(category.slug || category.name);
              return (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.id)}
                  title={category.name}
                >
                  <Icon size={20} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Marca */}
        <div className="filter-section">
          <h3 className="filter-title">Marca</h3>
          <select
            value={selectedMarca}
            onChange={handleMarcaChange}
            className="brand-select"
          >
            <option value="">Todas</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>

        {/* Precio */}
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
