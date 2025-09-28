import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/api";

export default function Activate() {
    const { uidb64, token } = useParams();
    const [msg, setMsg] = useState("Activando tu cuenta...");
    const navigate = useNavigate();

    useEffect(() => {
        const run = async () => {
        try {
            const res = await verifyEmail(uidb64, token);
            setMsg(res?.detail || "✅ Cuenta activada correctamente.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMsg(err?.message || "❌ Enlace inválido o expirado.");
        }
        };
        run();
    }, [uidb64, token, navigate]);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
        <h2>Activación de Cuenta</h2>
        <p>{msg}</p>
        </div>
    );
}
