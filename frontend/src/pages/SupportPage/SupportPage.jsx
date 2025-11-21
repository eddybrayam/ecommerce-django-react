import { useState } from "react";
import { sendSupportMessage } from "../../services/api";
import "./SupportPage.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";  // <-- Asegúrate que exista

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    order_code: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [statusType, setStatusType] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      await sendSupportMessage(formData);
      setStatusType("success");
      setStatusMsg("Tu mensaje fue enviado. Te responderemos pronto.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        order_code: "",
      });
    } catch (error) {
      console.error(error);
      setStatusType("error");
      setStatusMsg(
        error.response?.data?.detail ||
          "Ocurrió un error al enviar el mensaje. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />   {/* ✔ Navbar arriba */}

      <main className="page page-support">
        <div className="support-form-container">
          <h2>Soporte por correo</h2>
          <p>Cuéntanos tu problema o duda y te ayudamos.</p>

          <form onSubmit={handleSubmit} className="support-form">
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
              />
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="tucorreo@example.com"
              />
            </div>

            <div className="form-group">
              <label>Asunto</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Problema con mi pedido, duda, etc."
              />
            </div>

            <div className="form-group">
              <label>Código de pedido (opcional)</label>
              <input
                type="text"
                name="order_code"
                value={formData.order_code}
                onChange={handleChange}
                placeholder="Ej: ORD-12345"
              />
            </div>

            <div className="form-group">
              <label>Mensaje</label>
              <textarea
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe tu problema con detalle"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar mensaje"}
            </button>

            {statusMsg && (
              <p className={`status ${statusType}`}>{statusMsg}</p>
            )}
          </form>
        </div>
      </main>

      <Footer />  {/* ✔ Footer abajo */}
    </>
  );
};

export default SupportPage;
