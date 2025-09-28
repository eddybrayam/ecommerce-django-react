// src/pages/TechStoreHomepage.jsx
import React, { useState } from 'react';
import { 
  Laptop, Smartphone, Monitor, Headphones, ShoppingCart, User, 
  Star, Heart, Search, Menu, X, ChevronRight, Zap, Shield, Truck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TechStoreHomepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const goToLogin = () => { setMobileMenuOpen(false); navigate('/login'); };
  const goToRegisterClient = () => { setMobileMenuOpen(false); navigate('/registerclient'); };

  // Datos de productos de ejemplo
  const featuredProducts = [
    { id: 1, name: "MacBook Pro 14\"", category: "Laptops", price: 5499, originalPrice: 5999, image: "💻", rating: 4.8, reviews: 142, discount: 8, inStock: true, isNew: true },
    { id: 2, name: "iPhone 15 Pro Max", category: "Smartphones", price: 4299, originalPrice: 4699, image: "📱", rating: 4.9, reviews: 289, discount: 9, inStock: true, isBestSeller: true },
    { id: 3, name: "Dell UltraSharp 27\"", category: "Monitores", price: 899, originalPrice: 1199, image: "🖥️", rating: 4.7, reviews: 94, discount: 25, inStock: true },
    { id: 4, name: "Sony WH-1000XM5", category: "Audio", price: 799, originalPrice: 999, image: "🎧", rating: 4.8, reviews: 367, discount: 20, inStock: false },
    { id: 5, name: "Gaming Laptop ASUS ROG", category: "Laptops", price: 3299, originalPrice: 3799, image: "🎮", rating: 4.6, reviews: 78, discount: 13, inStock: true, isNew: true },
    { id: 6, name: "Samsung Galaxy S24 Ultra", category: "Smartphones", price: 3899, originalPrice: 4399, image: "📲", rating: 4.7, reviews: 203, discount: 11, inStock: true }
  ];

  const categories = [
    { name: "Laptops", icon: Laptop, count: 156, color: "#06b6d4" },
    { name: "Smartphones", icon: Smartphone, count: 89, color: "#3b82f6" },
    { name: "Monitores", icon: Monitor, count: 45, color: "#8b5cf6" },
    { name: "Audio", icon: Headphones, count: 67, color: "#10b981" }
  ];

  return (
    <div style={styles.container}>
      {/* Header/Navbar */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          {/* Logo */}
          <div style={styles.logoSection}>
            <div style={styles.logo}>
              <Laptop size={32} color="white" />
            </div>
            <div style={styles.brandInfo}>
              <h1 style={styles.brandName}>TechStore Pro</h1>
              <p style={styles.brandTagline}>Tu tienda de tecnología</p>
            </div>
          </div>

          {/* Barra de búsqueda - Desktop */}
          <div style={styles.searchBarDesktop}>
            <div style={styles.searchContainer}>
              <Search size={20} color="#6b7280" />
              <input
                type="text"
                placeholder="Buscar laptops, celulares, monitores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          {/* Botones de autenticación - Desktop */}
          <div style={styles.authButtons}>
            <button style={styles.loginButton} onClick={goToLogin}>
              <User size={18} />
              <span>Iniciar Sesión</span>
            </button>
            <button style={styles.registerButton} onClick={goToRegisterClient}>Crear Cuenta</button>
          </div>

          {/* Menú móvil toggle */}
          <button 
            style={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div style={styles.mobileMenu}>
            <div style={styles.mobileSearch}>
              <div style={styles.searchContainer}>
                <Search size={20} color="#6b7280" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  style={styles.searchInput}
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div style={styles.mobileAuthButtons}>
              <button style={styles.mobileLoginButton} onClick={goToLogin}>
                <User size={18} />
                <span>Iniciar Sesión</span>
              </button>
              <button style={styles.mobileRegisterButton} onClick={goToRegisterClient}>Crear Cuenta</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h2 style={styles.heroTitle}>
              La mejor tecnología
              <span style={styles.heroTitleAccent}> al mejor precio</span>
            </h2>
            <p style={styles.heroSubtitle}>
              Laptops, smartphones, monitores y más. Encuentra todo lo que necesitas 
              con garantía y envío gratis.
            </p>
            <div style={styles.heroFeatures}>
              <div style={styles.heroFeature}>
                <Truck size={20} color="#10b981" />
                <span>Envío gratis</span>
              </div>
              <div style={styles.heroFeature}>
                <Shield size={20} color="#3b82f6" />
                <span>Garantía extendida</span>
              </div>
              <div style={styles.heroFeature}>
                <Zap size={20} color="#f59e0b" />
                <span>Entrega rápida</span>
              </div>
            </div>
            <button style={styles.heroButton} onClick={goToRegisterClient}>
              Ver Ofertas
              <ChevronRight size={20} />
            </button>
          </div>
          <div style={styles.heroVisual}>
            <div style={styles.heroCard}>
              <div style={styles.heroProductImage}>💻</div>
              <h3>¡Ofertas Flash!</h3>
              <p>Hasta 30% OFF</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section style={styles.categoriesSection}>
        <div style={styles.sectionContent}>
          <h3 style={styles.sectionTitle}>Explora por Categorías</h3>
          <div style={styles.categoriesGrid}>
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} style={styles.categoryCard}>
                  <div style={{...styles.categoryIcon, backgroundColor: category.color}}>
                    <IconComponent size={32} color="white" />
                  </div>
                  <h4 style={styles.categoryName}>{category.name}</h4>
                  <p style={styles.categoryCount}>{category.count} productos</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section style={styles.productsSection}>
        <div style={styles.sectionContent}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Productos Destacados</h3>
            <button style={styles.viewAllButton} onClick={goToRegisterClient}>
              Ver todos
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <div key={product.id} style={styles.productCard}>
                {/* Badges */}
                <div style={styles.productBadges}>
                  {product.discount > 0 && (
                    <span style={styles.discountBadge}>-{product.discount}%</span>
                  )}
                  {product.isNew && (
                    <span style={styles.newBadge}>Nuevo</span>
                  )}
                  {product.isBestSeller && (
                    <span style={styles.bestSellerBadge}>Más vendido</span>
                  )}
                </div>

                {/* Imagen del producto */}
                <div style={styles.productImageContainer}>
                  <div style={styles.productImage}>{product.image}</div>
                  <button style={styles.favoriteButton} onClick={goToRegisterClient}>
                    <Heart size={20} />
                  </button>
                </div>

                {/* Información del producto */}
                <div style={styles.productInfo}>
                  <p style={styles.productCategory}>{product.category}</p>
                  <h4 style={styles.productName}>{product.name}</h4>
                  
                  {/* Rating */}
                  <div style={styles.productRating}>
                    <div style={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < Math.floor(product.rating) ? "#f59e0b" : "none"}
                          color="#f59e0b"
                        />
                      ))}
                    </div>
                    <span style={styles.ratingText}>
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Precios */}
                  <div style={styles.productPricing}>
                    <div style={styles.priceContainer}>
                      <span style={styles.currentPrice}>S/ {product.price}</span>
                      {product.originalPrice > product.price && (
                        <span style={styles.originalPrice}>S/ {product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Botón de compra */}
                  <button 
                    style={{
                      ...styles.addToCartButton,
                      ...(product.inStock ? {} : styles.outOfStockButton)
                    }}
                    onClick={product.inStock ? goToRegisterClient : undefined}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart size={18} />
                    <span>{product.inStock ? 'Agregar al carrito' : 'Agotado'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h3 style={styles.ctaTitle}>¿No tienes cuenta aún?</h3>
          <p style={styles.ctaSubtitle}>
            Regístrate y obtén descuentos exclusivos, envío gratis y garantía extendida
          </p>
          <div style={styles.ctaButtons}>
            <button style={styles.ctaPrimaryButton} onClick={goToRegisterClient}>Crear Cuenta Gratis</button>
            <button style={styles.ctaSecondaryButton} onClick={goToLogin}>Ver más productos</button>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: 'white'
  },
  
  // Header Styles
  header: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(34, 211, 238, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logo: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  brandName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #22d3ee, #60a5fa)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    margin: 0,
    lineHeight: 1
  },
  brandTagline: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    margin: 0
  },
  searchBarDesktop: {
    flex: 1,
    maxWidth: '400px',
    margin: '0 2rem',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    border: '1px solid #374151',
    borderRadius: '0.5rem',
    padding: '0.75rem'
  },
  searchInput: {
    flex: 1,
    marginLeft: '0.75rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '0.875rem',
    outline: 'none'
  },
  authButtons: {
    display: 'flex',
    gap: '0.75rem',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'transparent',
    border: '1px solid #374151',
    color: '#d1d5db',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease'
  },
  registerButton: {
    backgroundColor: 'linear-gradient(135deg, #0891b2, #2563eb)',
    background: 'linear-gradient(135deg, #0891b2, #2563eb)',
    border: 'none',
    color: 'white',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  mobileMenuButton: {
    display: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    '@media (max-width: 768px)': {
      display: 'block'
    }
  },
  mobileMenu: {
    display: 'none',
    backgroundColor: 'rgba(17, 24, 39, 0.98)',
    borderTop: '1px solid rgba(34, 211, 238, 0.2)',
    padding: '1rem 1.5rem',
    '@media (max-width: 768px)': {
      display: 'block'
    }
  },
  mobileSearch: {
    marginBottom: '1rem'
  },
  mobileAuthButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  mobileLoginButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: 'transparent',
    border: '1px solid #374151',
    color: '#d1d5db',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  mobileRegisterButton: {
    backgroundColor: 'linear-gradient(135deg, #0891b2, #2563eb)',
    background: 'linear-gradient(135deg, #0891b2, #2563eb)',
    border: 'none',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600'
  },

  // Hero Section
  heroSection: {
    background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1f2937 100%)',
    padding: '4rem 1.5rem'
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '3rem',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      textAlign: 'center'
    }
  },
  heroText: {
    flex: 1
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    lineHeight: 1.2,
    '@media (max-width: 768px)': {
      fontSize: '2rem'
    }
  },
  heroTitleAccent: {
    background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  },
  heroSubtitle: {
    fontSize: '1.125rem',
    color: '#9ca3af',
    marginBottom: '2rem',
    lineHeight: 1.6
  },
  heroFeatures: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem',
    '@media (max-width: 768px)': {
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  },
  heroFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#d1d5db',
    fontSize: '0.875rem'
  },
  heroButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, #0891b2, #2563eb)',
    border: 'none',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  heroVisual: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  heroCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    border: '1px solid rgba(34, 211, 238, 0.2)',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center',
    backdropFilter: 'blur(12px)'
  },
  heroProductImage: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },

  // Sections
  categoriesSection: {
    padding: '4rem 1.5rem',
    backgroundColor: '#111827'
  },
  productsSection: {
    padding: '4rem 1.5rem',
    backgroundColor: '#0f172a'
  },
  sectionContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    margin: 0
  },
  viewAllButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'transparent',
    border: '1px solid #374151',
    color: '#22d3ee',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease'
  },

  // Categories
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  categoryCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  categoryIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem'
  },
  categoryName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'white',
    margin: '0 0 0.5rem 0'
  },
  categoryCount: {
    color: '#9ca3af',
    fontSize: '0.875rem',
    margin: 0
  },

  // Products
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  productCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    borderRadius: '1rem',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    position: 'relative'
  },
  productBadges: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    zIndex: 2
  },
  discountBadge: {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  newBadge: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  bestSellerBadge: {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  productImageContainer: {
    position: 'relative',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.3)'
  },
  productImage: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  favoriteButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    color: '#9ca3af',
    padding: '0.5rem',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  productInfo: {
    padding: '1.5rem'
  },
  productCategory: {
    color: '#22d3ee',
    fontSize: '0.75rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  productName: {
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    lineHeight: 1.4
  },
  productRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  stars: {
    display: 'flex',
    gap: '0.125rem'
  },
  ratingText: {
    color: '#9ca3af',
    fontSize: '0.75rem'
  },
  productPricing: {
    marginBottom: '1.5rem'
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  currentPrice: {
    color: '#22d3ee',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  originalPrice: {
    color: '#6b7280',
    fontSize: '1rem',
    textDecoration: 'line-through'
  },
  addToCartButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    background: 'linear-gradient(135deg, #0891b2, #2563eb)',
    border: 'none',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  outOfStockButton: {
    backgroundColor: '#6b7280',
    background: '#6b7280',
    cursor: 'not-allowed'
  },

  // CTA Section
  ctaSection: {
    padding: '4rem 1.5rem',
    background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
    textAlign: 'center'
  },
  ctaContent: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  ctaTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem'
  },
  ctaSubtitle: {
    fontSize: '1.125rem',
    color: '#9ca3af',
    marginBottom: '2rem',
    lineHeight: 1.6
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  ctaPrimaryButton: {
    background: 'linear-gradient(135deg, #0891b2, #2563eb)',
    border: 'none',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  ctaSecondaryButton: {
    backgroundColor: 'transparent',
    border: '1px solid #374151',
    color: '#d1d5db',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  }
};
