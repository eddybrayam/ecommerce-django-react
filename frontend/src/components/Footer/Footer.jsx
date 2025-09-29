import { useState } from 'react';
import {
    Zap,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Linkedin,
    Send,
    CreditCard,
    Smartphone,
    Laptop,
    Tablet,
    Headphones,
    Gamepad2,
    ChevronRight,
    Heart
    } from 'lucide-react';
    import './Footer.css';

    const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
        setSubscribed(true);
        setTimeout(() => {
            setSubscribed(false);
            setEmail('');
        }, 3000);
        }
    };

    return (
        <footer className="footer">
        {/* Sección principal del footer */}
        <div className="footer-content">
            <div className="footer-container">
            
            {/* Columna 1: Información de la empresa */}
            <div className="footer-column footer-about">
                <div className="footer-logo">
                <Zap className="footer-logo-icon" />
                <span>SmartShop</span>
                </div>
                <p className="footer-description">
                Tu tienda de tecnología de confianza. Ofrecemos los mejores productos 
                con garantía, envío rápido y atención personalizada.
                </p>
                <div className="footer-contact">
                <a href="tel:+51999888777" className="contact-item">
                    <Phone size={18} />
                    <span>+51 999 888 777</span>
                </a>
                <a href="mailto:info@smartshop.com" className="contact-item">
                    <Mail size={18} />
                    <span>info@smartshop.com</span>
                </a>
                <div className="contact-item">
                    <MapPin size={18} />
                    <span>Arequipa, Perú</span>
                </div>
                </div>
            </div>

            {/* Columna 2: Enlaces rápidos */}
            <div className="footer-column">
                <h3 className="footer-title">Tienda</h3>
                <ul className="footer-links">
                <li><a href="#sobre-nosotros"><ChevronRight size={16} /> Sobre Nosotros</a></li>
                <li><a href="#como-comprar"><ChevronRight size={16} /> Cómo Comprar</a></li>
                <li><a href="#envios"><ChevronRight size={16} /> Envíos y Entregas</a></li>
                <li><a href="#garantia"><ChevronRight size={16} /> Garantía</a></li>
                <li><a href="#devoluciones"><ChevronRight size={16} /> Devoluciones</a></li>
                <li><a href="#ofertas"><ChevronRight size={16} /> Ofertas Especiales</a></li>
                </ul>
            </div>

            {/* Columna 3: Categorías */}
            <div className="footer-column">
                <h3 className="footer-title">Categorías</h3>
                <ul className="footer-links footer-categories">
                <li><a href="#laptops"><Laptop size={16} /> Laptops</a></li>
                <li><a href="#celulares"><Smartphone size={16} /> Celulares</a></li>
                <li><a href="#tablets"><Tablet size={16} /> Tablets</a></li>
                <li><a href="#accesorios"><Headphones size={16} /> Accesorios</a></li>
                <li><a href="#gaming"><Gamepad2 size={16} /> Gaming</a></li>
                <li><a href="#smartwatch"><Heart size={16} /> Smartwatches</a></li>
                </ul>
            </div>

            {/* Columna 4: Atención al cliente */}
            <div className="footer-column">
                <h3 className="footer-title">Ayuda</h3>
                <ul className="footer-links">
                <li><a href="#mi-cuenta"><ChevronRight size={16} /> Mi Cuenta</a></li>
                <li><a href="#rastrear-pedido"><ChevronRight size={16} /> Rastrear Pedido</a></li>
                <li><a href="#faqs"><ChevronRight size={16} /> Preguntas Frecuentes</a></li>
                <li><a href="#soporte"><ChevronRight size={16} /> Soporte Técnico</a></li>
                <li><a href="#contacto"><ChevronRight size={16} /> Contáctanos</a></li>
                <li><a href="#reclamos"><ChevronRight size={16} /> Libro de Reclamaciones</a></li>
                </ul>
            </div>

            {/* Columna 5: Newsletter */}
            <div className="footer-column footer-newsletter">
                <h3 className="footer-title">Newsletter</h3>
                <p className="newsletter-text">
                Suscríbete y recibe ofertas exclusivas, nuevos productos y promociones.
                </p>
                <form onSubmit={handleSubscribe} className="newsletter-form">
                <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="newsletter-input"
                    />
                </div>
                <button type="submit" className="newsletter-btn">
                    <Send size={18} />
                </button>
                </form>
                {subscribed && (
                <p className="subscribe-success">¡Gracias por suscribirte! 🎉</p>
                )}
                
                {/* Redes sociales */}
                <div className="social-media">
                <a href="#facebook" className="social-link" aria-label="Facebook">
                    <Facebook size={20} />
                </a>
                <a href="#instagram" className="social-link" aria-label="Instagram">
                    <Instagram size={20} />
                </a>
                <a href="#twitter" className="social-link" aria-label="Twitter">
                    <Twitter size={20} />
                </a>
                <a href="#youtube" className="social-link" aria-label="YouTube">
                    <Youtube size={20} />
                </a>
                <a href="#linkedin" className="social-link" aria-label="LinkedIn">
                    <Linkedin size={20} />
                </a>
                </div>
            </div>

            </div>
        </div>

        {/* Sección de métodos de pago */}
        <div className="footer-payment">
            <div className="footer-container">
            <div className="payment-content">
                <div className="payment-text">
                <CreditCard size={24} />
                <span>Métodos de pago aceptados</span>
                </div>
                <div className="payment-methods">
                <div className="payment-badge">Visa</div>
                <div className="payment-badge">Mastercard</div>
                <div className="payment-badge">PayPal</div>
                <div className="payment-badge">Yape</div>
                <div className="payment-badge">Plin</div>
                <div className="payment-badge">BCP</div>
                </div>
            </div>
            </div>
        </div>

        {/* Sección de copyright */}
        <div className="footer-bottom">
            <div className="footer-container">
            <div className="footer-bottom-content">
                <p className="copyright">
                © 2025 <strong>SmartShop</strong>. Todos los derechos reservados.
                </p>
                <div className="footer-legal">
                <a href="#privacidad">Política de Privacidad</a>
                <span className="separator">•</span>
                <a href="#terminos">Términos y Condiciones</a>
                <span className="separator">•</span>
                <a href="#cookies">Política de Cookies</a>
                </div>
            </div>
            </div>
        </div>
        </footer>
    );
};

export default Footer;