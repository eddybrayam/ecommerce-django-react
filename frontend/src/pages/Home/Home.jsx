import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Filters from "../../components/Filters";
import ProductList from "../../components/ProductList";
import PromoCarousel from "../../components/PromoCarousel";

// COMENTARIO: Asegúrate de que este archivo CSS se actualice
import './Home.css'; 


export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeFilters, setActiveFilters] = useState({
        categories: ["all"],
        marcas: [],
        priceRange: [0, 10000],
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("featured");

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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
                url += `sort_by=${sortBy}&`; 
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

    const handleFilterChange = useCallback((newFilters) => {
        setActiveFilters(newFilters);
    }, []);

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
    }, []);

    const handleSort = useCallback((value) => {
        setSortBy(value);
    }, []);

    const promoImages = [
        "/banners/black-friday.jpg",
        "/banners/navidad.jpg",
        "/banners/vuelta-clases.jpg",
    ];


    return (
        <div>
            <Navbar />
            
            <PromoCarousel images={promoImages} />
            
            {/* COMENTARIO: Usamos la clase 'home-page-content' para el contenedor principal
                           y quitamos el layout flex de dos columnas. */}
            <main className="home-page-content">
                
                {/* 🎯 FILTROS AHORA EN LA PARTE SUPERIOR */}
                <div className="filters-container-top">
                    <Filters
                        onFilterChange={handleFilterChange}
                        onSearch={handleSearch}
                        onSort={handleSort}
                    />
                </div>

                <section className="products-section-full">
                    
                    
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