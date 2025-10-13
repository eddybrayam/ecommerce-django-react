import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Filters from "../../components/Filters";
import ProductList from "../../components/ProductList";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
        .get(`${import.meta.env.VITE_API_URL}/api/products/`)
        .then((res) => {
            // Convertimos los datos del backend al formato que espera ProductCard
            const rawData = Array.isArray(res.data) ? res.data : res.data.results || [];
            const formatted = rawData.map((p) => ({
            id: p.producto_id,
            name: p.nombre,
            price: parseFloat(p.precio),
            image: p.imagen_url,
            category: `Cat. ${p.categoria_id}`,
            inStock: p.stock > 0,
            badge: p.stock <= 0 ? "out-of-stock" : undefined,
            }));
            setProducts(formatted);
        })
        .catch((err) => console.error("Error cargando productos:", err))
        .finally(() => setLoading(false));
    }, []);

    return (
        <div>
        <Navbar />

        <main>
            <aside>
            <Filters />
            </aside>

            <section>
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
