import { useState, useEffect } from 'react';
import {
  Search, SlidersHorizontal, X, ChevronDown,
  Laptop, Smartphone, Tablet, Headphones, Gamepad2, Watch
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

// Componente
const Filters = ({ onFilterChange, onSearch, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [selectedMarcas, setSelectedMarcas] = useState([]);
  const [isMarcasOpen, setIsMarcasOpen] = useState(false);
  const [categories, setCategories] = useState([{ id: 'all', name: 'Todas', slug: 'all' }]);
  
  const API_URL = 'http://127.0.0.1:8000/api';

  // Carga de datos
  useEffect(() => {
    fetch(`${API_URL}/marcas/`)
      .then((r) => r.json())
      .then(setMarcas)
      .catch((e) => console.error('Error al cargar marcas:', e));
    
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

  // useEffect centralizado para enviar filtros
  useEffect(() => {
    onFilterChange?.({
      categories: selectedCategories,
      marcas: selectedMarcas,
      priceRange: priceRange, // <-- El rango de precio se sigue enviando aquí
    });
  }, [selectedCategories, selectedMarcas, priceRange, onFilterChange]);


  // --- Handlers ---

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSort?.(value);
  };
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      if (categoryId === 'all') return ['all'];
      const newCategories = prev.filter(c => c !== 'all');
      const index = newCategories.indexOf(categoryId);
      if (index > -1) {
        newCategories.splice(index, 1);
      } else {
        newCategories.push(categoryId);
      }
      if (newCategories.length === 0) return ['all'];
      return newCategories;
    });
  };

  const handleMarcaChange = (e) => {
    const marcaId = e.target.value;
    const isChecked = e.target.checked;
    setSelectedMarcas((prev) => {
      if (isChecked) {
        return [...prev, marcaId];
      } else {
        return prev.filter(id => id !== marcaId);
      }
    });
  };

  // La lógica del precio sigue igual, solo actualiza el estado local.
  // El useEffect se encarga de enviarlo.
  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    
    if (index === 0 && Number(value) > newRange[1]) newRange[1] = Number(value);
    if (index === 1 && Number(value) < newRange[0]) newRange[0] = Number(value);

    setPriceRange(newRange); // <-- Solo actualiza el estado
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories(['all']);
    setPriceRange([0, 10000]);
    setSortBy('featured');
    setSelectedMarcas([]);
    onSearch?.('');
    onSort?.('featured');
  };

  const hasActiveFilters =
    (selectedCategories.length > 1 || (selectedCategories.length === 1 && selectedCategories[0] !== 'all')) ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000 ||
    searchTerm !== '' ||
    selectedMarcas.length > 0;

  const getMarcasLabel = () => {
    if (selectedMarcas.length === 0) return 'Todas las marcas';
    if (selectedMarcas.length === 1) {
      const marca = marcas.find(m => String(m.id) === selectedMarcas[0]);
      return marca ? marca.nombre : '1 seleccionada';
    }
    return `${selectedMarcas.length} marcas seleccionadas`;
  };

  // --- JSX ---
  return (
    <div className="filters-container">
      {/* ... Header (sin cambios) ... */}
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
              onChange={handleSortChange}
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
        {/* ... Categorías (sin cambios) ... */}
        <div className="filter-section">
          <h3 className="filter-title">Categorías</h3>
          <div className="categories-grid">
            {categories.map((category) => {
              const Icon = pickIcon(category.slug || category.name);
              return (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategories.includes(category.id) ? 'active' : ''}`}
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
        
        {/* ... Marcas (sin cambios) ... */}
        <div className="filter-section">
          <h3 className="filter-title">Marca</h3>
          <div className="checkbox-dropdown">
            <button
              type="button"
              className="dropdown-toggle"
              onClick={() => setIsMarcasOpen(!isMarcasOpen)}
            >
              <span>{getMarcasLabel()}</span>
              <ChevronDown 
                size={18} 
                className={`dropdown-icon ${isMarcasOpen ? 'rotate' : ''}`} 
              />
            </button>
            
            {isMarcasOpen && (
              <div className="dropdown-panel">
                {marcas.map((m) => (
                  <label key={m.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={m.id}
                      checked={selectedMarcas.includes(String(m.id))}
                      onChange={handleMarcaChange}
                    />
                    <span>{m.nombre}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ✅ INICIO: SECCIÓN DE PRECIO RESTAURADA */}
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
        {/* ✅ FIN: SECCIÓN DE PRECIO RESTAURADA */}

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