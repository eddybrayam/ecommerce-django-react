import { useEffect, useState, useCallback } from "react"; // ✅ 1. Importa useCallback
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Filters from "../../components/Filters";
import ProductList from "../../components/ProductList";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ 2. Estado de filtros dividido para evitar bucles
    const [activeFilters, setActiveFilters] = useState({
        categories: ["all"],
        marcas: [],
        priceRange: [0, 10000],
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("featured"); // Añadido para 'onSort'

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    // ✅ 3. useEffect ahora vigila los 3 estados
    useEffect(() => {
        fetchProducts();
    }, [activeFilters, searchTerm, sortBy]); 

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/api/products/?`;

            // 🔸 1. Buscar por nombre
            if (searchTerm) {
                url += `search=${searchTerm}&`;
            }

             // 🔸 2. Ordenar
            if (sortBy && sortBy !== "featured") {
                url += `sort_by=${sortBy}&`; // Ajusta 'sort_by' al nombre de tu parámetro de API
            }

            // ✅ 4. Lógica de array para categorías
            if (activeFilters.categories && !activeFilters.categories.includes("all")) {
                activeFilters.categories.forEach(catId => {
                    url += `categoria=${catId}&`; 
                });
            }

            // ✅ 5. Lógica de array para marcas
            if (activeFilters.marcas && activeFilters.marcas.length > 0) {
                activeFilters.marcas.forEach(marcaId => {
                    url += `marca=${marcaId}&`; 
                });
            }

            // 🔸 6. Filtrar por rango de precios
            if (activeFilters.priceRange) {
                url += `min_precio=${activeFilters.priceRange[0]}&max_precio=${activeFilters.priceRange[1]}&`;
            }

            const res = await axios.get(url);
            const formatted = res.data.map((p) => ({
                id: p.producto_id || p.id,
                name: p.nombre,
                price: parseFloat(p.precio),
                image: p.imagen_principal
                    ? p.imagen_principal
                    : p.imagen_url || "/placeholder.jpg",
                category: p.categoria_nombre || (p.categoria ? `Cat. ${p.categoria}` : "Sin categoría"),
                inStock: p.stock > 0,
                badge: p.stock <= 0 ? "out-of-stock" : undefined,
                // Pasa también estos datos por si ProductCard los usa
                rating_avg: p.rating_avg, 
                rating_count: p.rating_count,
                ...p
            }));
            setProducts(formatted);
        } catch (err) {
            console.error("Error cargando productos:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ 6. USA USECALLBACK para "memorizar" las funciones
    // Esto es lo que rompe el bucle infinito.
    const handleFilterChange = useCallback((newFilters) => {
        setActiveFilters(newFilters);
    }, []); // El array vacío [] significa que esta función NUNCA cambia

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
    }, []); // Esta función NUNCA cambia

    const handleSort = useCallback((value) => {
        setSortBy(value);
    }, []); // Esta función NUNCA cambia

    return (
        <div>
            <Navbar />
            <main className="home-layout">
                <aside className="filters-sidebar">
                    {/* ✅ 7. Pasa los 3 handlers memorizados */}
                    <Filters
                        onFilterChange={handleFilterChange}
                        onSearch={handleSearch}
                        onSort={handleSort}
                    />
                </aside>

                <section className="products-section">
                    <h1>Página principal de TechStore</h1>
                    {loading ? (
                        <p style={{ textAlign: "center" }}>Cargando productos...</p>
                    ) : (
                        <ProductList products={products} />
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}