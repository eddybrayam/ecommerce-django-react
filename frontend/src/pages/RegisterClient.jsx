// src/pages/RegisterClient.jsx
import React, { useState } from "react";
import { 
  Eye, EyeOff, Mail, Lock, Laptop, User, MapPin, CreditCard, 
  AlertCircle, Phone, ArrowRight 
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle, registerWithEmail } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./RegisterClient.css"; // ✅ IMPORTA TU CSS

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
  const { signInWithTokens } = useAuth();

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
        username: formData.email.trim().toLowerCase(),
        first_name: formData.nombres.trim(),
        last_name: formData.apellidos.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.direccion.trim(),
        dni: formData.dni.trim(),
        phone: formData.celular.trim() || undefined,
        password: formData.password,
        password2: formData.confirmPassword,
      };

      await registerWithEmail(payload);
      setApiMsg("✅ Cuenta creada. Revisa tu correo para activar tu cuenta.");
      setTimeout(() => navigate("/login"), 2500);
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
        await signInWithTokens(data);
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
    <div className="register-page">
      <div className="register-container">

        <div className="register-header">
          <Laptop size={40} color="#2563eb" />
          <h1>Crear Cuenta</h1>
          <p>Únete a la familia TechStore Pro</p>
        </div>

        <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />

        <div className="divider">
          <span>o completa el formulario</span>
        </div>

        <div className="form-section">

          <div className="input-row">
            <Input icon={<User />} name="nombres" placeholder="Nombres"
              value={formData.nombres} onChange={handleInputChange} error={errors.nombres} />
            <Input icon={<User />} name="apellidos" placeholder="Apellidos"
              value={formData.apellidos} onChange={handleInputChange} error={errors.apellidos} />
          </div>

          <Input icon={<Mail />} name="email" placeholder="Correo electrónico"
            value={formData.email} onChange={handleInputChange} error={errors.email} />

          <Input icon={<MapPin />} name="direccion" placeholder="Dirección completa"
            value={formData.direccion} onChange={handleInputChange} error={errors.direccion} />

          <div className="input-row">
            <Input icon={<CreditCard />} name="dni" placeholder="DNI (8 dígitos)" maxLength={8}
              value={formData.dni} onChange={handleInputChange} error={errors.dni} />
            <Input icon={<Phone />} name="celular" placeholder="Celular (opcional)" maxLength={9}
              value={formData.celular} onChange={handleInputChange} error={errors.celular} />
          </div>

          <div className="input-row">
            <PasswordInput name="password" placeholder="Contraseña"
              value={formData.password} onChange={handleInputChange}
              error={errors.password} show={showPassword} setShow={setShowPassword} />
            <PasswordInput name="confirmPassword" placeholder="Confirmar contraseña"
              value={formData.confirmPassword} onChange={handleInputChange}
              error={errors.confirmPassword} show={showConfirmPassword} setShow={setShowConfirmPassword} />
          </div>

          <div className="terms">
            <label>
              <input 
                type="checkbox" 
                checked={accepted} 
                onChange={(e)=>setAccepted(e.target.checked)}
              />
              <span>Acepto los términos y condiciones y la política de privacidad</span>
            </label>
            {errors.terms && <ErrorLine text={errors.terms} />}
          </div>

          <button className="register-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear mi cuenta"}
            {!loading && <ArrowRight size={20} />}
          </button>

          {!!apiMsg && <div className="api-message">{apiMsg}</div>}

          <div className="login-link">
            <span>¿Ya tienes cuenta?</span>{" "}
            <button onClick={()=>navigate("/login")}>Iniciar sesión</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Componentes auxiliares ---------- */

function Input({ icon, error, ...props }) {
  return (
    <div className="input-group">
      {icon}
      <input {...props} />
      {error && <ErrorLine text={error} />}
    </div>
  );
}

function PasswordInput({ name, value, onChange, placeholder, error, show, setShow }) {
  return (
    <div className="input-group">
      <Lock />
      <input
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button type="button" onClick={()=>setShow(!show)}>
        {show ? <EyeOff /> : <Eye />}
      </button>
      {error && <ErrorLine text={error} />}
    </div>
  );
}

function ErrorLine({ text }) {
  return (
    <div className="error-line">
      <AlertCircle size={14} />
      <span>{text}</span>
    </div>
  );
}
