import { useState } from 'react';
import { 
    Search, 
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

    const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Cambiar a false para ver vista de no logueado
    
    // Datos de ejemplo
    const cartItems = 3;
    const favoritesCount = 5;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
        <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="navbar-container">
            
            {/* Logo */}
            <div className="navbar-logo">
            <Zap className="logo-icon" />
            <span className="logo-text">SmartShop</span>
            </div>

            {/* Barra de búsqueda - Desktop */}
            <div className="search-bar desktop-search">
            <Search className="search-icon" />
            <input 
                type="text" 
                placeholder="Buscar laptops, celulares, accesorios..."
                className="search-input"
            />
            <button className="search-button">Buscar</button>
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
                        <p className="user-name">Juan Pérez</p>
                        <p className="user-email">juan@email.com</p>
                        </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <a href="#cuenta"><Settings size={16} /> Mi Cuenta</a>
                    <a href="#pedidos"><Package size={16} /> Mis Pedidos</a>
                    <a href="#favoritos"><Heart size={16} /> Favoritos</a>
                    <div className="dropdown-divider"></div>
                    <a 
                    href="#logout" 
                    className="logout"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLoggedIn(false);
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
                    onClick={() => setIsLoggedIn(true)}
                >
                    Iniciar Sesión
                </button>
                <button 
                    className="btn-primary"
                    onClick={() => setIsLoggedIn(true)}
                >
                    Registrarse
                </button>
                </div>
            )}

            {/* Carrito */}
            <div className="cart-container">
                <button className="action-btn cart-btn" onClick={toggleCart}>
                <ShoppingCart size={20} />
                {cartItems > 0 && (
                    <span className="badge cart-badge">{cartItems}</span>
                )}
                </button>
                {isCartOpen && (
                <div className="cart-dropdown">
                    <h3>Carrito de Compras</h3>
                    <div className="cart-items">
                    <div className="cart-item">
                        <div className="item-image"></div>
                        <div className="item-info">
                        <p className="item-name">Laptop HP Pavilion</p>
                        <p className="item-price">$899.99</p>
                        </div>
                    </div>
                    <div className="cart-item">
                        <div className="item-image"></div>
                        <div className="item-info">
                        <p className="item-name">Mouse Logitech MX</p>
                        <p className="item-price">$49.99</p>
                        </div>
                    </div>
                    </div>
                    <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-price">$949.98</span>
                    </div>
                    <button className="btn-cart">Ver Carrito Completo</button>
                </div>
                )}
            </div>

            {/* Menú hamburguesa - Mobile */}
            <button className="menu-toggle" onClick={toggleMenu}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            </div>
        </div>

        {/* Barra de búsqueda - Mobile */}
        <div className="search-bar mobile-search">
            <Search className="search-icon" />
            <input 
            type="text" 
            placeholder="Buscar productos..."
            className="search-input"
            />
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
            <li><a href="#favoritos" onClick={toggleMenu}>
                <Heart size={16} /> Favoritos ({favoritesCount})
            </a></li>
            {!isLoggedIn && (
                <>
                <li><a 
                    href="#login" 
                    onClick={(e) => {
                    e.preventDefault();
                    setIsLoggedIn(true);
                    toggleMenu();
                    }}
                >
                    Iniciar Sesión
                </a></li>
                <li><a 
                    href="#register" 
                    onClick={(e) => {
                    e.preventDefault();
                    setIsLoggedIn(true);
                    toggleMenu();
                    }}
                >
                    Registrarse
                </a></li>
                </>
            )}
            {isLoggedIn && (
                <>
                <li><a href="#cuenta" onClick={toggleMenu}>Mi Cuenta</a></li>
                <li><a href="#pedidos" onClick={toggleMenu}>Mis Pedidos</a></li>
                <li><a 
                    href="#logout" 
                    className="logout" 
                    onClick={(e) => {
                    e.preventDefault();
                    setIsLoggedIn(false);
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