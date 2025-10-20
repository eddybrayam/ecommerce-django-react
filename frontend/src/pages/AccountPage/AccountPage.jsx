import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AccountPage() {
  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "4rem 2rem",
          background: "linear-gradient(to bottom, #f9fafb, #f1f5f9)",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "2rem 3rem",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "700px",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Mi Cuenta 👤
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#555",
              marginBottom: "2rem",
              fontSize: "1rem",
            }}
          >
            Bienvenido a tu panel personal. Desde aquí puedes revisar tus pedidos,
            tus datos y la actividad de tu cuenta.
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <li>
              <Link
                to="/account/orders"
                style={{
                  display: "block",
                  padding: "1rem 1.5rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
              >
                📦 Mis pedidos
              </Link>
            </li>

            <li>
              <Link
                to="/account/settings"
                style={{
                  display: "block",
                  padding: "1rem 1.5rem",
                  backgroundColor: "#f3f4f6",
                  color: "#333",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
              >
                ⚙️ Configuración de cuenta
              </Link>
            </li>

            <li>
              <Link
                to="/logout"
                style={{
                  display: "block",
                  padding: "1rem 1.5rem",
                  backgroundColor: "#fee2e2",
                  color: "#b91c1c",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#fecaca")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#fee2e2")}
              >
                🚪 Cerrar sesión
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
}
