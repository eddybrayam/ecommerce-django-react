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
    CreditCard,
    } from "lucide-react";
    import "./Footer.css";

    const Footer = () => {
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
                Tu tienda de tecnología de confianza. Ofrecemos los mejores
                productos con garantía, envío rápido y atención personalizada.
                </p>

                <div className="footer-contact">
                <div className="contact-item">
                    <Phone size={18} />
                    <span>+51 999 888 777</span>
                </div>
                <div className="contact-item">
                    <Mail size={18} />
                    <span>info@smartshop.com</span>
                </div>
                <div className="contact-item">
                    <MapPin size={18} />
                    <span>Arequipa, Perú</span>
                </div>
                </div>
            </div>

            {/* Columna 2: Redes sociales */}
            <div className="footer-column footer-social">
                <h3 className="footer-title">Síguenos</h3>
                <p className="footer-description">
                Conéctate con nosotros en nuestras redes sociales y entérate de
                novedades, lanzamientos y promociones.
                </p>

                <div className="social-media">
                    <a 
                        href="https://www.facebook.com/tecsup?locale=es_LA"
                        className="social-link"
                        aria-label="Facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Facebook size={20}/>                    
                    </a>
                    <a 
                        href="https://www.instagram.com/vive_tecsup/"
                        className="social-link"
                        aria-label="Instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Instagram size={20}/>                    
                    </a>

                    <a
                        href="https://x.com/Tecsup_pe"
                        className="social-link"
                        aria-label="Twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Twitter size={20} />
                    </a>

                    <a
                        href="https://www.youtube.com/c/tecsupinstitucioneducativa"
                        className="social-link"
                        aria-label="YouTube"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Youtube size={20} />
                    </a>

                    <a
                        href="https://www.linkedin.com/in/klinsman-flores/"
                        className="social-link"
                        aria-label="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Linkedin size={20} />
                    </a>
                
                
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
