import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Filters from "../../components/Filters";
import ProductList from "../../components/ProductList";

export default function Home() {
    return (
        <div>
        <Navbar />

        <main>
            <aside>
            <Filters />
            </aside>

            <section>
            <h1>Página principal de TechStore</h1>
            <ProductList />
            </section>
        </main>

        <Footer />
        </div>
    );
}
