import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Filters from "../../components/Filters";
import ProductList from "../../components/ProductList";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Estado que guarda todos los filtros activos
    const [filters, setFilters] = useState({
        search: "",
        category: "all",
        priceRange: [0, 10000],
        marca: "",
    });

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    // 🔹 Cargar productos cada vez que cambian los filtros
    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/api/products/?`;

            // 🔸 Buscar por nombre
            if (filters.search) {
                url += `search=${filters.search}&`;
            }

            // 🔸 Filtrar por categoría (si el backend lo soporta)
            if (filters.category && filters.category !== "all") {
                url += `categoria=${filters.category}&`;
            }

            // 🔸 Filtrar por marca
            if (filters.marca) {
                url += `marca=${filters.marca}&`;
            }

            // 🔸 Filtrar por rango de precios
            if (filters.priceRange) {
                url += `min_precio=${filters.priceRange[0]}&max_precio=${filters.priceRange[1]}&`;
            }

            const res = await axios.get(url);
            const formatted = res.data.map((p) => ({
                id: p.producto_id || p.id,
                name: p.nombre,
                price: parseFloat(p.precio),
                image: p.imagen_principal
                    ? p.imagen_principal
                    : p.imagen_url || "/placeholder.jpg",
                category: p.categoria ? `Cat. ${p.categoria}` : "Sin categoría",
                inStock: p.stock > 0,
                badge: p.stock <= 0 ? "out-of-stock" : undefined,
            }));
            setProducts(formatted);
        } catch (err) {
            console.error("Error cargando productos:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Recibir cambios desde Filters
    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const handleSearch = (value) => {
        setFilters((prev) => ({ ...prev, search: value }));
    };

    return (
        <div>
            <Navbar />

            <main className="home-layout">
                <aside className="filters-sidebar">
                    <Filters
                        onFilterChange={handleFilterChange}
                        onSearch={handleSearch}
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
