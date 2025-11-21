import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer";
import "./AccountPage.css"; 

// COMENTARIO: Asumimos que useAuth se puede importar desde la ruta correcta
import { useAuth } from "../../context/AuthContext"; 

// --- Importación de iconos de la librería react-icons/hi2 (Heroicons) ---
import { 
  HiOutlineArchiveBox, 
  HiOutlineMapPin, 
  HiOutlineHeart, 
  HiOutlineTruck, 
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineListBullet,
  HiOutlineUserCircle
} from "react-icons/hi2"; 
// -----------------------------------------------------------------------

// =====================================================================
// Componente Modal Simulado para Direcciones
// =====================================================================
const AddressModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // COMENTARIO: Aquí se cargaría dinámicamente la dirección principal
  const sampleAddress = "Av. Las Flores 123, Urb. Primavera, Lima, Perú (Dirección principal)";

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>📍 Mis Direcciones de Envío</h3>
        <p>Tu dirección principal registrada para envíos.</p>
        
        <div className="current-address">
            <strong>Dirección Principal:</strong>
            <p>{sampleAddress}</p>
        </div>
        
        <button className="modal-close-btn" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

// =====================================================================
// Componente Principal AccountPage
// =====================================================================
export default function AccountPage() {
    
    const { user, loading } = useAuth() || {};
    const [isAddressesModalOpen, setIsAddressesModalOpen] = useState(false);

    // Acceso seguro a los datos del usuario
    const displayUserName = user?.first_name || user?.username || 'Usuario';
    const displayUserEmail = user?.email || 'email@no-disponible.com';
    
    // Variables Fijas/Simuladas
    const latestOrder = "Pedido #1 — Entregado"; 
    const latestOrderDate = "15/05/2025";
    const wishlistCount = 5; 

    const handleOpenAddressesModal = () => setIsAddressesModalOpen(true);
    const handleCloseAddressesModal = () => setIsAddressesModalOpen(false);


    // LÓGICA DE CARGA Y AUTENTICACIÓN
    if (loading) {
        return (
             <div style={{ padding: '50px', textAlign: 'center', fontSize: '1.2em', color: '#007bff' }}>
                Cargando información de la cuenta... 🔄
            </div>
        );
    }
    
    if (!user) {
        return (
            <div style={{ padding: '50px', textAlign: 'center', color: '#dc3545', fontSize: '1.2em' }}>
                Acceso denegado: Debes iniciar sesión para ver tu cuenta.
            </div>
        );
    }

    // RENDERIZADO PRINCIPAL
    return (
        <>
            <Navbar />

            <div className="account-wrapper">

                {/* Encabezado con Icono y Bienvenida */}
                <header className="account-header-modern">
                    <div className="header-icon-container">
                        <HiOutlineUserCircle size={50} className="user-icon-large" />
                    </div>
                    <div>
                        <h1>Hola, {displayUserName} 👋</h1>
                        <p className="account-subtitle">
                            Bienvenido a tu panel personal. Gestiona tus actividades de compra.
                        </p>
                    </div>
                </header>
                
                {/* LAYOUT PRINCIPAL: FLEX (70% - 30%) */}
                <div className="account-main-layout">
                    
                    {/* Columna Principal (70%): Pedidos y Datos */}
                    <main className="main-content-section">
                        
                        {/* Bloque: Información Personal (Fondo más prominente) */}
                        <section className="account-box personal-info-box-modern">
                            <h3 className="section-title">Información de Contacto</h3>
                            
                            <div className="info-details-container">
                                <div className="info-detail-item">
                                    <HiOutlineUser size={20} className="detail-icon" />
                                    <div className="detail-text">
                                        <strong>Nombre Completo</strong>
                                        <p>{displayUserName}</p>
                                    </div>
                                </div>

                                <div className="info-detail-item">
                                    <HiOutlineEnvelope size={20} className="detail-icon" />
                                    <div className="detail-text">
                                        <strong>Correo Electrónico</strong>
                                        <p>{displayUserEmail}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="note">
                                *Contacta a soporte si necesitas cambiar tu nombre o correo.
                            </p>
                        </section>

                        {/* Bloque: Último Pedido (Destacado) */}
                        <section className="account-box latest-order-box-modern">
                            <div className="order-summary">
                                <div className="order-status-badge">
                                    <HiOutlineTruck size={24} />
                                    <span>{latestOrder}</span>
                                </div>
                                <p className="order-date">Fecha: **{latestOrderDate}**</p>
                            </div>

                            <div className="order-actions-footer">
                                <Link to="/account/orders" className="link-btn primary-compact">
                                    <HiOutlineArchiveBox size={18} className="btn-icon" /> Ver Historial Completo
                                </Link>
                            </div>
                        </section>

                    </main>

                    {/* Columna Lateral (30%): Acciones Rápidas */}
                    <aside className="sidebar-info-section">
                        
                        {/* Bloque de Acciones Rápidas */}
                        <section className="account-box quick-actions-box">
                            <h3 className="section-title">Acciones Rápidas</h3>
                            
                            <div className="quick-action-list">
                                <button 
                                    onClick={handleOpenAddressesModal} 
                                    className="action-tile addresses-tile"
                                >
                                    <HiOutlineMapPin size={24} />
                                    <span>Direcciones de Envío</span>
                                </button>
                                
                                <Link to="/account/wishlist" className="action-tile wishlist-tile">
                                    <HiOutlineHeart size={24} />
                                    <span>Lista de Deseos ({wishlistCount})</span>
                                </Link>
                                
                                <Link to="/account/orders" className="action-tile orders-tile">
                                    <HiOutlineListBullet size={24} />
                                    <span>Detalles de Pedidos</span>
                                </Link>
                            </div>
                        </section>

                    </aside>
                </div>
            </div>

            {/* Modal */}
            <AddressModal 
                isOpen={isAddressesModalOpen}
                onClose={handleCloseAddressesModal}
            />

            <Footer />
        </>
    );
}