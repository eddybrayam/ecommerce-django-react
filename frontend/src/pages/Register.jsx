import { useState } from "react";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ username:"", email:"", password:"", password2:"" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/api/accounts/register/", form);
      setMsg("✅ Usuario registrado. Ahora inicia sesión.");
    } catch (err) {
      const detail = err?.response?.data;
      setMsg(`❌ Error: ${JSON.stringify(detail)}`);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{display:"grid", gap:8, maxWidth:340}}>
      <h2>Registro</h2>
      <input name="username" placeholder="Usuario" value={form.username} onChange={onChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
      <input name="password" type="password" placeholder="Contraseña (≥8)" value={form.password} onChange={onChange} required />
      <input name="password2" type="password" placeholder="Repite contraseña" value={form.password2} onChange={onChange} required />
      <button>Crear cuenta</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
