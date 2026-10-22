
import { useLayoutEffect, useRef } from "react";
import { Text, Link } from "@fluentui/react-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/Footer.css";
import logoFarmaxis from "../assets/logoFooter.png";

gsap.registerPlugin(ScrollTrigger);

// Icono de Facebook
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.1H7v3.2h2.8V21h3.7Z" />
    </svg>
  );
}

// Icono de Instagram
function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Icono representativo de TikTok
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M19.6 8.1a7.1 7.1 0 0 1-4.3-1.4v7.1a5.5 5.5 0 1 1-5.5-5.5c.4 0 .8 0 1.2.1v3a2.5 2.5 0 1 0 1.3 2.2V2.5h3a4.3 4.3 0 0 0 4.3 4.3v1.3Z" />
    </svg>
  );
}

function Footer() {
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-column-animated", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          once: true,
        },
      });

      gsap.from(".footer-bottom", {
        y: 15,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          once: true,
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-content">
        
<section className="footer-brand footer-column-animated">
  
<div className="footer-brand-logo">
  <img
    src={logoFarmaxis}
    alt="Logo de Farmaxis"
    className="footer-logo-image"
  />
</div>


  <p className="footer-description">
    Cuidados de ti y de tu familia
    <br />
    con productos de calidad.
  </p>
</section>


        <section className="footer-column footer-column-animated">
          <h3>Farmaxis</h3>
          <Link href="/">Inicio</Link>
          <Link href="/categorias">Categorías</Link>
          <Link href="/ofertas">Ofertas</Link>
          <Link href="/mi-cuenta">Mi cuenta</Link>
        </section>

        <section className="footer-column footer-column-animated">
          <h3>Ayuda</h3>
          <Link href="/preguntas-frecuentes">Preguntas frecuentes</Link>
          <Link href="/envios">Envíos y entregas</Link>
          <Link href="/terminos">Términos y privacidad</Link>
        </section>

        <section className="footer-column footer-column-animated">
          <h3>Contáctanos</h3>
          <p>
            Línea de atención
            <br />
            +57 300 000 0000
            <br />
            contacto@farmaxis.co
          </p>
        </section>

        <section className="footer-column footer-column-animated">
          <h3>Síguenos</h3>

          <div className="social-list">
            <div className="social-item">
              <span className="social-icon">
                <FacebookIcon />
              </span>
              <a
                href="https://www.facebook.com/farmaxiscol"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Farmaxis"
              >
                @farmaxiscol
              </a>
            </div>

            <div className="social-item">
              <span className="social-icon">
                <InstagramIcon />
              </span>
              <a
                href="https://www.instagram.com/farmaxiscol/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Farmaxis"
              >
                @farmaxiscol
              </a>
            </div>

            <div className="social-item">
              <span className="social-icon">
                <TikTokIcon />
              </span>
              <a
                href="https://www.tiktok.com/@farmaxiscol"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de Farmaxis"
              >
                @farmaxiscol
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className="footer-bottom">
        <Text>
          © 2026 Farmaxis. Todos los derechos reservados.
        </Text>
      </div>
    </footer>
  );
}

export default Footer;
