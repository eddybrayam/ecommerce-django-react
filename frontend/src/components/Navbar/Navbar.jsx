import React from 'react';
import { useState, useEffect, useRef } from 'react';
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
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const userMenuRef = useRef(null);
    const cartRef = useRef(null);

    const { user, logout } = useAuth() || {};
    const isLoggedIn = !!user;

    const { cartItems, total } = useCart();
    const favoritesCount = 0;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const navigate = useNavigate();

    // 👉 Manejar click en icono del carrito
    const handleCartButtonClick = () => {
        if (!isLoggedIn) {
            alert("Debes iniciar sesión para ver tu carrito.");
            navigate("/login");
            return;
        }
        setIsCartOpen(!isCartOpen);
    };

    // 👉 Manejar click en "Ver Carrito Completo"
    const handleGoToCartPage = () => {
        if (!isLoggedIn) {
            alert("Debes iniciar sesión para ver tu carrito.");
            navigate("/login");
            return;
        }
        navigate("/cart");
        setIsCartOpen(false);
    };

    // Persistencia modo oscuro
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(savedDarkMode);
        if (savedDarkMode) document.documentElement.classList.add('dark');
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Cerrar dropdowns al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            if (isCartOpen && cartRef.current && !cartRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen, isCartOpen]);

    return (
        <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="navbar-container">

                {/* Logo */}
                <div className="navbar-logo" onClick={() => navigate("/")}>
                    <Zap className="logo-icon" />
                    <span className="logo-text">SmartShop</span>
                </div>

                {/* Links */}
                <ul className="nav-links">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/soporte">Soporte</Link></li>
                </ul>

                {/* Acciones */}
                <div className="navbar-actions">

                    {/* Dark mode */}
                    <button className="action-btn" onClick={toggleDarkMode}>
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Favoritos */}
                    <button className="action-btn favorites-btn" onClick={() => navigate('/account/wishlist')}>
                        <Heart size={20} />
                        {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
                    </button>

                    {/* Usuario */}
                    {isLoggedIn ? (
                        <div className="user-menu" ref={userMenuRef}>
                            <button className="action-btn user-btn" onClick={toggleUserMenu}>
                                <User size={20} />
                            </button>

                            {isUserMenuOpen && (
                                <div className="user-dropdown">
                                    <div className="user-info">
                                        <User size={32} />
                                        <div>
                                            <p className="user-name">{user?.first_name || user?.username || "Usuario"}</p>
                                            <p className="user-email">{user?.email || ""}</p>
                                        </div>
                                    </div>

                                    <div className="dropdown-divider" />

                                    <Link to="/account" onClick={() => setIsUserMenuOpen(false)}>
                                        <Settings size={16} /> Mi Cuenta
                                    </Link>

                                    <Link to="/account/orders" onClick={() => setIsUserMenuOpen(false)}>
                                        <Package size={16} /> Mis Pedidos
                                    </Link>

                                    <Link to="/account/wishlist" onClick={() => setIsUserMenuOpen(false)}>
                                        <Heart size={16} /> Favoritos
                                    </Link>

                                    <div className="dropdown-divider" />

                                    <button className="logout-button" onClick={() => { logout(); navigate('/'); }}>
                                        <LogOut size={16} /> Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button className="btn-secondary" onClick={() => navigate('/login')}>Iniciar Sesión</button>
                            <button className="btn-primary" onClick={() => navigate('/register')}>Registrarse</button>
                        </div>
                    )}

                    {/* Carrito */}
                    <div className="cart-container" ref={cartRef}>
                        <button className="action-btn cart-btn" onClick={handleCartButtonClick}>
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
                                        <p className="empty-cart-message">Tu carrito está vacío</p>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div className="cart-item" key={item.id}>
                                                <img src={item.image} className="item-image" />
                                                <div className="item-info">
                                                    <p className="item-name">{item.name}</p>
                                                    <p className="item-price">S/ {item.price.toFixed(2)}</p>
                                                    <p className="item-quantity">x{item.quantity}</p>
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

                                        <button className="btn-cart" onClick={handleGoToCartPage}>
                                            Ver Carrito Completo
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile */}
                    <button className="menu-toggle" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Menú Mobile */}
            <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
                <ul>
                    <li><Link to="/" onClick={toggleMenu}>Inicio</Link></li>
                    
                    <li><Link to="/soporte" onClick={toggleMenu}>Soporte</Link></li>

                    {isLoggedIn ? (
                        <>
                            <li className="divider"></li>
                            <li><Link to="/account" onClick={toggleMenu}>Mi Cuenta</Link></li>
                            <li><Link to="/account/orders" onClick={toggleMenu}>Mis Pedidos</Link></li>

                            <li>
                                <button className="mobile-logout-btn" onClick={() => { logout(); toggleMenu(); navigate('/'); }}>
                                    <LogOut size={16} /> Cerrar Sesión
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="divider"></li>
                            <li><Link to="/login" className="btn-secondary" onClick={toggleMenu}>Iniciar Sesión</Link></li>
                            <li><Link to="/register" className="btn-primary" onClick={toggleMenu}>Registrarse</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
