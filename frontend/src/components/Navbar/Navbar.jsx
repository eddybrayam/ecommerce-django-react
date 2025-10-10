import { useState, useEffect } from 'react';
import { 
    ShoppingCart, 
    Heart, 
    User, 
    Menu, 
    X, 
    ChevronDown,
    LogOut,
    Package,
    Settings,
    Zap,
    Moon,
    Sun
} from 'lucide-react';
import './Navbar.css';
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ← Importa tu AuthContext

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // Usa el contexto de autenticación real
    const { user, logout, loading } = useAuth() || {};

    const isLoggedIn = !!user;

    const { cartItems, total } = useCart();
    const favoritesCount = 0; // Ajusta si usas un contexto de favoritos

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const navigate = useNavigate();

    // Persistir modo oscuro en localStorage (opcional pero útil)
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(savedDarkMode);
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Si estás cargando, puedes mostrar un estado neutro
    if (loading) {
        return (
            <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <Zap className="logo-icon" />
                        <span className="logo-text">SmartShop</span>
                    </div>
                    <div className="navbar-actions">
                        <div className="action-btn">Cargando...</div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="navbar-container">
                
                {/* Logo */}
                <div className="navbar-logo">
                    <Zap className="logo-icon" />
                    <span className="logo-text">SmartShop</span>
                </div>

                {/* Links de navegación - Desktop */}
                <ul className="nav-links">
                    <li><a href="#inicio">Inicio</a></li>
                    <li className="dropdown">
                        <a href="#categorias">
                            Categorías <ChevronDown size={16} />
                        </a>
                        <div className="dropdown-menu">
                            <a href="#laptops">Laptops</a>
                            <a href="#celulares">Celulares</a>
                            <a href="#tablets">Tablets</a>
                            <a href="#accesorios">Accesorios</a>
                            <a href="#gaming">Gaming</a>
                        </div>
                    </li>
                    <li><a href="#ofertas" className="ofertas-link">
                        <Zap size={16} /> Ofertas
                    </a></li>
                    <li><a href="#contacto">Contacto</a></li>
                </ul>

                {/* Acciones - Desktop */}
                <div className="navbar-actions">
                    
                    {/* Modo oscuro */}
                    <button className="action-btn" onClick={toggleDarkMode}>
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Favoritos */}
                    <button className="action-btn favorites-btn">
                        <Heart size={20} />
                        {favoritesCount > 0 && (
                            <span className="badge">{favoritesCount}</span>
                        )}
                    </button>

                    {/* Usuario */}
                    {isLoggedIn ? (
                        <div className="user-menu">
                            <button className="action-btn user-btn" onClick={toggleUserMenu}>
                                <User size={20} />
                            </button>
                            {isUserMenuOpen && (
                                <div className="user-dropdown">
                                    <div className="user-info">
                                        <User size={32} />
                                        <div>
                                            <p className="user-name">
                                                {user?.first_name || user?.username || 'Usuario'}
                                            </p>
                                            <p className="user-email">{user?.email || ''}</p>
                                        </div>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <a href="#cuenta" onClick={() => navigate('/account')}>
                                        <Settings size={16} /> Mi Cuenta
                                    </a>
                                    <a href="#pedidos" onClick={() => navigate('/orders')}>
                                        <Package size={16} /> Mis Pedidos
                                    </a>
                                    <a href="#favoritos" onClick={() => navigate('/favorites')}>
                                        <Heart size={16} /> Favoritos
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a 
                                        href="#logout" 
                                        className="logout"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            logout();
                                            setIsUserMenuOpen(false);
                                        }}
                                    >
                                        <LogOut size={16} /> Cerrar Sesión
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button 
                                className="btn-secondary"
                                onClick={() => navigate('/login')}
                            >
                                Iniciar Sesión
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={() => navigate('/register')}
                            >
                                Registrarse
                            </button>
                        </div>
                    )}

                    {/* Carrito */}
                    <div className="cart-container">
                        <button className="action-btn cart-btn" onClick={toggleCart}>
                            <ShoppingCart size={20} />
                            {cartItems.length > 0 && (
                                <span className="badge cart-badge">{cartItems.length}</span>
                            )}
                        </button>
                        {isCartOpen && (
                            <div className="cart-dropdown">
                                <h3>Carrito de Compras</h3>
                                <div className="cart-items">
                                    {cartItems.length === 0 ? (
                                        <p style={{ textAlign: "center", color: "#6b7280" }}>Tu carrito está vacío</p>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div className="cart-item" key={item.id}>
                                                <img src={item.image} alt={item.name} className="item-image" />
                                                <div className="item-info">
                                                    <p className="item-name">{item.name}</p>
                                                    <p className="item-price">S/ {item.price.toFixed(2)}</p>
                                                    <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>x{item.quantity}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {cartItems.length > 0 && (
                                    <>
                                        <div className="cart-total">
                                            <span>Total:</span>
                                            <span className="total-price">S/ {total.toFixed(2)}</span>
                                        </div>
                                        <button className="btn-cart" onClick={() => {
                                            navigate("/cart");
                                            setIsCartOpen(false);
                                        }}>
                                            Ver Carrito Completo
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Menú hamburguesa - Mobile */}
                    <button className="menu-toggle" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Menú móvil */}
            <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <ul>
                    <li><a href="#inicio" onClick={toggleMenu}>Inicio</a></li>
                    <li><a href="#categorias" onClick={toggleMenu}>Categorías</a></li>
                    <li><a href="#ofertas" onClick={toggleMenu}>
                        <Zap size={16} /> Ofertas
                    </a></li>
                    <li><a href="#contacto" onClick={toggleMenu}>Contacto</a></li>
                    <li><a href="#favoritos" onClick={() => {
                        navigate('/favorites');
                        toggleMenu();
                    }}>
                        <Heart size={16} /> Favoritos ({favoritesCount})
                    </a></li>
                    {!isLoggedIn ? (
                        <>
                            <li><a 
                                href="#login" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/login');
                                    toggleMenu();
                                }}
                            >
                                Iniciar Sesión
                            </a></li>
                            <li><a 
                                href="#register" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/register');
                                    toggleMenu();
                                }}
                            >
                                Registrarse
                            </a></li>
                        </>
                    ) : (
                        <>
                            <li><a href="#cuenta" onClick={() => {
                                navigate('/account');
                                toggleMenu();
                            }}>Mi Cuenta</a></li>
                            <li><a href="#pedidos" onClick={() => {
                                navigate('/orders');
                                toggleMenu();
                            }}>Mis Pedidos</a></li>
                            <li><a 
                                href="#logout" 
                                className="logout" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    logout();
                                    toggleMenu();
                                }}
                            >
                                <LogOut size={16} /> Cerrar Sesión
                            </a></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;