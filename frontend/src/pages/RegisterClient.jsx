// src/pages/RegisterClient.jsx
import React, { useState } from "react";
import { 
  Eye, EyeOff, Mail, Lock, Laptop, User, MapPin, CreditCard, AlertCircle, Phone, ArrowRight, Check 
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { registerClient, loginWithGoogle, setTokens, getMe } from "../services/api";

export default function RegisterClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiMsg, setApiMsg] = useState("");
  const [formData, setFormData] = useState({
    nombres: "", apellidos: "", email: "", direccion: "",
    dni: "", celular: "", password: "", confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.nombres.trim()) e.nombres = "Los nombres son requeridos";
    if (!formData.apellidos.trim()) e.apellidos = "Los apellidos son requeridos";
    if (!formData.email.trim()) e.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email inválido";
    if (!formData.direccion.trim()) e.direccion = "La dirección es requerida";
    if (!formData.dni.trim() || !/^\d{8}$/.test(formData.dni)) e.dni = "DNI debe tener 8 dígitos";
    if (formData.celular && !/^\d{9}$/.test(formData.celular)) e.celular = "Celular debe tener 9 dígitos";
    if (!formData.password || formData.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Las contraseñas no coinciden";
    if (!accepted) e.terms = "Debes aceptar los términos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setApiMsg("");
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        first_name: formData.nombres.trim(),
        last_name: formData.apellidos.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.direccion.trim(),
        dni: formData.dni.trim(),
        phone: formData.celular.trim() || undefined,
        password: formData.password,
        password2: formData.confirmPassword,
      };
      const data = await registerClient(payload);
      if (data?.access && data?.refresh) {
        setTokens({ access: data.access, refresh: data.refresh });
        const me = await getMe();
        localStorage.setItem("me", JSON.stringify(me));
        navigate("/");
      } else {
        setApiMsg("✅ Cuenta creada, ahora inicia sesión.");
        setTimeout(()=>navigate("/login"), 700);
      }
    } catch (err) {
      setApiMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (res) => {
    setApiMsg("");
    try {
      const data = await loginWithGoogle(res.credential);
      if (data?.access && data?.refresh) {
        setTokens({ access: data.access, refresh: data.refresh });
        const me = await getMe();
        localStorage.setItem("me", JSON.stringify(me));
        navigate("/");
      } else {
        setApiMsg("✅ Vinculado con Google. Inicia sesión.");
      }
    } catch (e) {
      setApiMsg("❌ " + e.message);
    }
  };
  
  const onGoogleError = () => setApiMsg("❌ Error con Google");

  return (
    <div style={styles.container}>
      {/* Floating particles effect */}
      <div style={styles.particles}>
        {[...Array(8)].map((_, i) => (
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
          <h1 style={styles.title}>Crear Cuenta</h1>
          <p style={styles.subtitle}>Únete a la familia TechStore Pro</p>
        </div>

        <div style={styles.googleContainer}>
          <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
        </div>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>o completa el formulario</span>
          <div style={styles.dividerLine}></div>
        </div>

        <div style={styles.form}>
          <div style={styles.row}>
            <Input
              icon={<User size={20} color="#64748b" />}
              name="nombres" placeholder="Nombres"
              value={formData.nombres} onChange={handleInputChange}
              error={errors.nombres}
            />
            <Input
              icon={<User size={20} color="#64748b" />}
              name="apellidos" placeholder="Apellidos"
              value={formData.apellidos} onChange={handleInputChange}
              error={errors.apellidos}
            />
          </div>

          <Input
            icon={<Mail size={20} color="#64748b" />}
            name="email" placeholder="Correo electrónico"
            value={formData.email} onChange={handleInputChange}
            error={errors.email}
          />

          <Input
            icon={<MapPin size={20} color="#64748b" />}
            name="direccion" placeholder="Dirección completa"
            value={formData.direccion} onChange={handleInputChange}
            error={errors.direccion}
          />

          <div style={styles.row}>
            <Input
              icon={<CreditCard size={20} color="#64748b" />}
              name="dni" placeholder="DNI (8 dígitos)" maxLength={8}
              value={formData.dni} onChange={handleInputChange}
              error={errors.dni}
            />
            <Input
              icon={<Phone size={20} color="#64748b" />}
              name="celular" placeholder="Celular (opcional)" maxLength={9}
              value={formData.celular} onChange={handleInputChange}
              error={errors.celular}
            />
          </div>

          <div style={styles.row}>
            <PasswordInput
              name="password" placeholder="Contraseña"
              value={formData.password} onChange={handleInputChange}
              error={errors.password}
              show={showPassword} setShow={setShowPassword}
            />
            <PasswordInput
              name="confirmPassword" placeholder="Confirmar contraseña"
              value={formData.confirmPassword} onChange={handleInputChange}
              error={errors.confirmPassword}
              show={showConfirmPassword} setShow={setShowConfirmPassword}
            />
          </div>

          <div style={styles.checkboxContainer}>
            <label style={styles.checkboxLabel}>
              <div style={styles.customCheckbox}>
                <input 
                  type="checkbox" 
                  checked={accepted} 
                  onChange={(e)=>setAccepted(e.target.checked)}
                  style={styles.hiddenCheckbox}
                />
                <div style={{
                  ...styles.checkboxBox,
                  background: accepted ? "linear-gradient(135deg, #06b6d4, #3b82f6)" : "transparent",
                  borderColor: accepted ? "#06b6d4" : errors.terms ? "#ef4444" : "#334155"
                }}>
                  {accepted && <Check size={14} color="#fff" />}
                </div>
              </div>
              <span style={styles.checkboxText}>
                Acepto los <span style={styles.linkText}>términos y condiciones</span> y la <span style={styles.linkText}>política de privacidad</span>
              </span>
            </label>
            {errors.terms && <ErrorLine text={errors.terms} />}
          </div>

          <button 
            onClick={handleSubmit} 
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
              {loading ? "Creando cuenta..." : "Crear mi cuenta"}
            </span>
            {!loading && <ArrowRight size={20} style={styles.submitIcon} />}
            {loading && <div style={styles.spinner} />}
          </button>

          {!!apiMsg && (
            <div style={styles.msgContainer}>
              <div style={{
                ...styles.msg,
                background: apiMsg.startsWith("✅") ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                borderColor: apiMsg.startsWith("✅") ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                color: apiMsg.startsWith("✅") ? "#22c55e" : "#f87171"
              }}>
                {apiMsg}
              </div>
            </div>
          )}

          <div style={styles.helperRow}>
            <span style={styles.helperText}>¿Ya tienes cuenta?</span>
            <button 
              onClick={()=>navigate("/login")} 
              style={styles.linkBtn}
              onMouseEnter={(e) => e.target.style.color = "#0ea5e9"}
              onMouseLeave={(e) => e.target.style.color = "#06b6d4"}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ icon, error, ...props }) {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <div style={styles.inputIcon}>{icon}</div>
      <input
        {...props}
        style={{
          ...styles.input,
          borderColor: error ? "#ef4444" : "#334155"
        }}
        onFocus={(e) => e.target.style.borderColor = error ? "#ef4444" : "#0ea5e9"}
        onBlur={(e) => e.target.style.borderColor = error ? "#ef4444" : "#334155"}
      />
      {error && <ErrorLine text={error} />}
    </div>
  );
}

function PasswordInput({ name, value, onChange, placeholder, error, show, setShow }) {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <div style={styles.inputIcon}><Lock size={20} color="#64748b" /></div>
      <input
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...styles.input,
          paddingRight: "48px",
          borderColor: error ? "#ef4444" : "#334155"
        }}
        onFocus={(e) => e.target.style.borderColor = error ? "#ef4444" : "#0ea5e9"}
        onBlur={(e) => e.target.style.borderColor = error ? "#ef4444" : "#334155"}
      />
      <button 
        type="button" 
        onClick={()=>setShow(!show)} 
        style={styles.passwordToggle}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
      >
        {show ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
      </button>
      {error && <ErrorLine text={error} />}
    </div>
  );
}

function ErrorLine({ text }) {
  return (
    <div style={styles.errorLine}>
      <AlertCircle size={14} />
      <span>{text}</span>
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
    width: "3px",
    height: "3px",
    background: "linear-gradient(45deg, #06b6d4, #3b82f6)",
    borderRadius: "50%",
    opacity: 0.4,
    animation: "float 8s ease-in-out infinite"
  },
  particle0: { top: "15%", left: "8%", animationDelay: "0s" },
  particle1: { top: "85%", left: "15%", animationDelay: "1s" },
  particle2: { top: "35%", left: "85%", animationDelay: "2s" },
  particle3: { top: "65%", left: "75%", animationDelay: "3s" },
  particle4: { top: "5%", left: "65%", animationDelay: "4s" },
  particle5: { top: "95%", left: "95%", animationDelay: "5s" },
  particle6: { top: "45%", left: "5%", animationDelay: "6s" },
  particle7: { top: "25%", left: "45%", animationDelay: "7s" },
  card: {
    width: "100%",
    maxWidth: 600,
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
    marginBottom: 20
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
    gap: 20,
    marginTop: 12
  },
  row: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap"
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
  checkboxContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    cursor: "pointer"
  },
  customCheckbox: {
    position: "relative",
    marginTop: 2
  },
  hiddenCheckbox: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none"
  },
  checkboxBox: {
    width: 20,
    height: 20,
    border: "2px solid #334155",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    flexShrink: 0
  },
  checkboxText: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: "1.4",
    flex: 1
  },
  linkText: {
    color: "#06b6d4",
    fontWeight: "500"
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
    fontSize: 14,
    textAlign: "center",
    border: "1px solid",
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
  },
  errorLine: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#ef4444",
    fontSize: 12,
    marginTop: 8,
    animation: "slideIn 0.2s ease"
  }
};