import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ShoppingBag, ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { loginWithPassword, loginWithGoogle } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signInWithTokens } = useAuth();

  const doPasswordLogin = async () => {
    setMsg("");
    setLoading(true);
    try {
      const tokens = await loginWithPassword(email.trim().toLowerCase(), password);
      await signInWithTokens(tokens);
      navigate("/");
    } catch (e) {
      setMsg("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (res) => {
    setMsg("");
    setLoading(true);
    try {
      const tokens = await loginWithGoogle(res.credential);
      await signInWithTokens(tokens);
      navigate("/");
    } catch (e) {
      setMsg("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleError = () => setMsg("❌ Error con Google");

  return (
    <div className="login-container">
      {/* Fondo animado */}
      <div className="particles">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Tarjeta de login */}
      <div className="login-card">
        <div className="login-header">
          <div className="logo-wrapper">
            <div className="logo">
              <ShoppingBag className="icon" />
            </div>
            <div className="glow" />
          </div>
          <h1 className="login-title">Bienvenido a TechStore Pro</h1>
          
        </div>

        <div className="google-login">
          <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
        </div>

        <div className="divider">
          <span>o inicia con tu correo</span>
        </div>

        <div className="form">
          {/* Campo email */}
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="input"
            />
          </div>

          {/* Campo password */}
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Botón principal */}
          <button
            onClick={doPasswordLogin}
            disabled={loading}
            className="submit-btn"
          >
            {loading ? <div className="spinner" /> : <ArrowRight />}
            <span>{loading ? "Ingresando..." : "Iniciar Sesión"}</span>
          </button>

          {/* Mensaje */}
          {msg && <div className="msg">{msg}</div>}

          {/* Registro */}
          <div className="register-row">
            <p>¿No tienes cuenta?</p>
            <button
              onClick={() => navigate("/register")}
              className="register-link"
            >
              Crear una gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
