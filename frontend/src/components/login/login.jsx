import React, { useState } from "react";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de login (mock)
    setTimeout(() => {
      alert(`Bienvenido ${email}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="split">
      {/* Panel izquierdo */}
      <div className="left">
        <div className="left-inner">
          <div className="brand-star">✶</div>
          <h1 className="hero">
            Bienvenido
            <br />
            SmartShop! <span className="wave">🛒</span>
          </h1>
          <p className="tag">
            Explora lo último en tecnología.
            Encuentra tus gadgets favoritos al mejor precio y con la mejor calidad.!
          </p>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="right">
        <div className="form-box">
          <h2 className="welcome-title">Bienvenido</h2>
          <p className="subtitle">Inicia sesión en tu cuenta</p>

          {/* Botón Google */}
          <button className="btn google">
            <span className="google-icon">🌐</span> Continuar con Google
          </button>

          <div className="divider">
            <span>o continúa con email</span>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <span className="icon">📧</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="options">
              <label>
                <input type="checkbox" /> Recordarme
              </label>
              <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="register">
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}

