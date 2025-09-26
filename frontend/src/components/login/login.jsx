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
          <h2>SaleSkip</h2>
          <h3>Welcome Back!</h3>
          <p className="small">
            Don't have an account?{" "}
            <a href="/register">Create a new account now</a>
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Loading..." : "Login Now"}
            </button>
          </form>

          <button className="btn google">G Login with Google</button>

          <div className="small links">
            <a href="/forgot-password">Forget password? Click here</a>
          </div>
        </div>
      </div>
    </div>
  );
}
