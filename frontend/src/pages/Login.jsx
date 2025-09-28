// src/pages/Login.jsx
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Laptop, ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { loginWithPassword, loginWithGoogle, setTokens, getMe } from "../services/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const doPasswordLogin = async () => {
    setMsg("");
    setLoading(true);
    try {
      const tokens = await loginWithPassword(email.trim().toLowerCase(), password);
      setTokens(tokens);
      const me = await getMe();
      localStorage.setItem("me", JSON.stringify(me));
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
      setTokens(tokens);
      const me = await getMe();
      localStorage.setItem("me", JSON.stringify(me));
      navigate("/");
    } catch (e) {
      setMsg("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleError = () => setMsg("❌ Error con Google");

  return (
    <div style={styles.container}>
      {/* Floating particles effect */}
      <div style={styles.particles}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{...styles.particle, ...styles[`particle${i}`]}} />
        ))}
      </div>
      
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>
              <Laptop size={40} color="#fff" />
            </div>
            <div style={styles.logoGlow} />
          </div>
          <h1 style={styles.title}>Inicia Sesión</h1>
          <p style={styles.subtitle}>Bienvenido de vuelta a TechStore Pro</p>
        </div>

        <div style={styles.googleContainer}>
          <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
        </div>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>o continúa con email</span>
          <div style={styles.dividerLine}></div>
        </div>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={styles.inputIcon}>
              <Mail size={20} color="#64748b" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Correo electrónico"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
              onBlur={(e) => e.target.style.borderColor = "#334155"}
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.inputIcon}>
              <Lock size={20} color="#64748b" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Contraseña"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
              onBlur={(e) => e.target.style.borderColor = "#334155"}
            />
            <button 
              type="button" 
              onClick={()=>setShowPassword(!showPassword)} 
              style={styles.passwordToggle}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              {showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
            </button>
          </div>

          <button 
            onClick={doPasswordLogin} 
            disabled={loading} 
            style={{
              ...styles.submit, 
              opacity: loading ? 0.8 : 1,
              transform: loading ? "scale(0.98)" : "scale(1)"
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => !loading && (e.target.style.transform = "translateY(0)")}
          >
            <span style={styles.submitText}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </span>
            {!loading && <ArrowRight size={20} style={styles.submitIcon} />}
            {loading && <div style={styles.spinner} />}
          </button>

          {!!msg && (
            <div style={styles.msgContainer}>
              <div style={styles.msg}>{msg}</div>
            </div>
          )}

          <div style={styles.helperRow}>
            <span style={styles.helperText}>¿No tienes cuenta?</span>
            <button 
              onClick={()=>navigate("/registerClient")} 
              style={styles.linkBtn}
              onMouseEnter={(e) => e.target.style.color = "#0ea5e9"}
              onMouseLeave={(e) => e.target.style.color = "#06b6d4"}
            >
              Crear cuenta gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0c1426 0%, #111827 35%, #0f172a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    position: "relative",
    overflow: "hidden"
  },
  particles: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none"
  },
  particle: {
    position: "absolute",
    width: "4px",
    height: "4px",
    background: "linear-gradient(45deg, #06b6d4, #3b82f6)",
    borderRadius: "50%",
    opacity: 0.6,
    animation: "float 6s ease-in-out infinite"
  },
  particle0: { top: "20%", left: "10%", animationDelay: "0s" },
  particle1: { top: "80%", left: "20%", animationDelay: "1s" },
  particle2: { top: "40%", left: "80%", animationDelay: "2s" },
  particle3: { top: "70%", left: "70%", animationDelay: "3s" },
  particle4: { top: "10%", left: "60%", animationDelay: "4s" },
  particle5: { top: "90%", left: "90%", animationDelay: "5s" },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "rgba(15, 23, 42, 0.95)",
    border: "1px solid rgba(6, 182, 212, 0.2)",
    borderRadius: 24,
    padding: 32,
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    position: "relative",
    zIndex: 1
  },
  header: {
    textAlign: "center",
    marginBottom: 24
  },
  logoContainer: {
    position: "relative",
    display: "inline-block",
    marginBottom: 16
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)",
    boxShadow: "0 8px 32px rgba(6, 182, 212, 0.3)",
    position: "relative",
    zIndex: 2
  },
  logoGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100px",
    height: "100px",
    background: "radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)",
    borderRadius: "50%",
    filter: "blur(10px)",
    zIndex: 1
  },
  title: {
    margin: 0,
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "800",
    background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    margin: "8px 0 0 0",
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "400"
  },
  googleContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
    "& button": {
      borderRadius: "12px !important"
    }
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    margin: "20px 0"
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "linear-gradient(90deg, transparent 0%, #334155 50%, transparent 100%)"
  },
  dividerText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
    whiteSpace: "nowrap"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    marginTop: 12
  },
  inputGroup: {
    position: "relative"
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2
  },
  input: {
    width: "100%",
    padding: "16px 16px 16px 48px",
    background: "rgba(30, 41, 59, 0.8)",
    border: "2px solid #334155",
    color: "#f8fafc",
    borderRadius: 14,
    outline: "none",
    fontSize: 16,
    fontWeight: "400",
    transition: "all 0.3s ease",
    boxSizing: "border-box"
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    borderRadius: 6,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  submit: {
    width: "100%",
    padding: "16px 24px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #0891b2 0%, #2563eb 50%, #7c3aed 100%)",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 4px 15px rgba(8, 145, 178, 0.4)",
    position: "relative",
    overflow: "hidden"
  },
  submitText: {
    position: "relative",
    zIndex: 2
  },
  submitIcon: {
    transition: "transform 0.2s ease"
  },
  spinner: {
    width: 20,
    height: 20,
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  msgContainer: {
    animation: "slideIn 0.3s ease"
  },
  msg: {
    padding: "12px 16px",
    color: "#f87171",
    fontSize: 14,
    textAlign: "center",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: 10,
    fontWeight: "500"
  },
  helperRow: {
    marginTop: 8,
    display: "flex",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap"
  },
  helperText: {
    color: "#94a3b8",
    fontSize: 14
  },
  linkBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#06b6d4",
    fontWeight: "600",
    fontSize: 14,
    transition: "all 0.2s ease",
    textDecoration: "none",
    padding: "4px 0"
  }
};