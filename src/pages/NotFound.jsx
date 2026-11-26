import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight20Regular, Box24Regular, Cart24Regular, Chat24Regular, ChevronDown20Regular, Clock24Regular, DocumentText24Regular, Mail24Regular, Payment24Regular, Person24Regular, QuestionCircle24Regular, Shield24Regular, VehicleTruck24Regular } from "@fluentui/react-icons";
import gsap from "gsap";
import faqBackground from "../assets/help-faq-bg.svg";
import shippingBackground from "../assets/help-shipping-bg.svg";
import termsBackground from "../assets/help-terms-bg.svg";

const helpPages = {
  faq: { path: "/preguntas-frecuentes", title: "Preguntas frecuentes", intro: "Encuentra respuestas rápidas sobre tus compras, pedidos y productos en Farmaxis.", heroImage: faqBackground, sectionTitle: "Preguntas frecuentes", topics: [[Cart24Regular, "Compras", "Cómo comprar, productos y disponibilidad."], [Box24Regular, "Pedidos", "Registro, estado y seguimiento."], [Payment24Regular, "Pagos", "Medios de pago, validación y seguridad."], [Shield24Regular, "Devoluciones", "Cambios, devoluciones y condiciones."], [Person24Regular, "Cuenta", "Registro, acceso y gestión de datos."]], questions: [["¿Cómo realizo una compra?", "Busca el producto que necesitas, selecciona la cantidad y agrégalo al carrito. Luego revisa tu compra y finaliza el proceso."], ["¿Cómo sé si mi pedido fue registrado?", "Al finalizar recibirás una confirmación en pantalla y podrás consultar o descargar la factura de tu compra."], ["¿Cuánto tarda en llegar mi pedido?", "El tiempo depende de la ciudad, la zona de cobertura y la disponibilidad del producto."], ["¿Qué medios de pago aceptan?", "Durante el proceso de compra podrás consultar las opciones de pago disponibles."], ["¿Puedo devolver o cambiar un producto?", "Revisa las condiciones de devolución o comunícate con nuestra línea de atención para recibir orientación."]] },
  shipping: { path: "/envios", title: "Envíos y entregas", intro: "Conoce nuestra cobertura, tiempos de entrega, costos y cómo realizar el seguimiento de tu pedido.", heroImage: shippingBackground, sectionTitle: "Preguntas frecuentes relacionadas", topics: [[VehicleTruck24Regular, "Tiempos de entrega", "Recibe tu pedido en el menor tiempo posible, según tu ciudad y zona de cobertura."], [Payment24Regular, "Costo del envío", "Conoce el valor del envío y las condiciones para acceder a envío con descuento o gratuito."], [Box24Regular, "Zonas de cobertura", "Revisa las ciudades y zonas donde realizamos entregas."], [DocumentText24Regular, "Seguimiento del pedido", "Consulta el estado de tu compra en línea y conoce la fecha estimada de entrega."], [VehicleTruck24Regular, "Modalidades de entrega", "Elige entrega a domicilio o retiro en tienda según disponibilidad."]], questions: [["¿Cuánto tarda en llegar mi pedido?", "El plazo se confirma según la dirección registrada y la disponibilidad de tus productos."], ["¿Cuánto cuesta el envío?", "El valor se informa antes de finalizar la compra, de acuerdo con la zona de entrega."], ["¿Cómo hago el seguimiento de mi pedido?", "Conserva los datos de tu factura o comunícate con nuestro equipo de atención."], ["¿Puedo elegir recoger mi pedido en una tienda?", "Esta modalidad depende de la disponibilidad indicada durante el proceso de compra."]] },
  terms: { path: "/terminos", title: "Términos y privacidad", intro: "Consulta las políticas, condiciones y el tratamiento de tu información en Farmaxis.", heroImage: termsBackground, sectionTitle: "Aspectos importantes", topics: [[DocumentText24Regular, "Términos de uso", "Conoce las condiciones que regulan el uso del sitio web y nuestros servicios."], [Shield24Regular, "Política de privacidad", "Descubre cómo recopilamos, usamos y protegemos tu información personal."], [Person24Regular, "Datos personales", "Infórmate sobre el tratamiento de tus datos y las finalidades de su uso."], [Shield24Regular, "Seguridad", "Conoce las medidas que implementamos para proteger tu información y tus compras."], [Payment24Regular, "Compras y pagos", "Revisa las condiciones de compra, medios de pago y validación de transacciones."], [ArrowRight20Regular, "Devoluciones", "Consulta la política, plazos y condiciones para realizar devoluciones o cambios."]], questions: [["¿Cómo protegemos tu información?", "Aplicamos medidas organizativas y técnicas para cuidar los datos que necesitamos para prestar el servicio."], ["¿Qué datos recopilamos?", "Usamos los datos de contacto y compra necesarios para procesar pedidos, emitir facturas y brindar atención."], ["¿Cuáles son las condiciones de compra?", "La disponibilidad, el valor de envío y las condiciones aplicables se confirman antes de finalizar la compra."], ["¿Cómo puedes ejercer tus derechos?", "Puedes escribirnos a contacto@farmaxis.co para solicitar orientación sobre tus datos personales."]] },
};

function ContactCard() { return <aside className="help-page__contact"><h2>¿Necesitas más ayuda?</h2><p>Contáctanos y con gusto te acompañamos.</p><a href="https://wa.me/573000000000" target="_blank" rel="noreferrer"><Chat24Regular /><span><strong>WhatsApp</strong>+57 300 000 0000</span><ArrowRight20Regular /></a><a href="mailto:contacto@farmaxis.co"><Mail24Regular /><span><strong>Correo electrónico</strong>contacto@farmaxis.co</span><ArrowRight20Regular /></a><div className="help-page__schedule"><Clock24Regular /><span><strong>Horario de atención</strong>Lunes a sábado: 8:00 a. m. – 7:00 p. m.</span></div></aside>; }
function HelpPage({ content, page }) {
  const [openQuestion, setOpenQuestion] = useState(0);
  const pageRef = useRef(null);
  const questionsRef = useRef(null);

  useEffect(() => {
    setOpenQuestion(0);
  }, [page]);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const animation = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power2.out" } })
        .fromTo(".help-page__nav", { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.4 })
        .fromTo(".help-page__hero", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.24")
        .fromTo(".help-page__section-title", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.32 }, "-=0.2")
        .fromTo(".help-page__questions article", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.06 }, "-=0.16")
        .fromTo(".help-page__contact", { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.4 }, "-=0.26");
    }, pageRef);

    return () => animation.revert();
  }, [page]);

  useLayoutEffect(() => {
    if (openQuestion < 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const answer = questionsRef.current?.querySelectorAll("article")[openQuestion]?.querySelector("p");
    if (!answer) return undefined;

    const animation = gsap.fromTo(
      answer,
      { height: 0, autoAlpha: 0, y: -4 },
      { height: "auto", autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out", clearProps: "height,opacity,transform" },
    );
    return () => animation.kill();
  }, [openQuestion]);

  const toggleQuestion = (index, event) => {
    if (index !== openQuestion && openQuestion >= 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const currentAnswer = questionsRef.current?.querySelector("article.is-open p");
      if (currentAnswer) {
        gsap.to(currentAnswer, {
          height: 0,
          autoAlpha: 0,
          y: -4,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => setOpenQuestion(index),
        });
        return;
      }
    }

    if (index === openQuestion && event.currentTarget.nextElementSibling && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(event.currentTarget.nextElementSibling, {
        height: 0,
        autoAlpha: 0,
        y: -4,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setOpenQuestion(-1),
      });
      return;
    }

    setOpenQuestion(index === openQuestion ? -1 : index);
  };

  return (
    <section className="help-page" aria-labelledby="help-page-title" ref={pageRef}>
      <div className="help-page__layout">
        <nav className="help-page__nav" aria-label="Secciones de ayuda">
          <h2>Ayuda</h2>
          {Object.entries(helpPages).map(([key, item]) => {
            const Icon = key === "faq" ? QuestionCircle24Regular : key === "shipping" ? VehicleTruck24Regular : Shield24Regular;
            return <Link key={key} to={item.path} className={page === key ? "is-active" : ""}><Icon />{item.title}</Link>;
          })}
        </nav>
        <div className="help-page__main">
          <header className="help-page__hero" style={{ "--help-background": `url(${content.heroImage})` }}>
            <div><p>AYUDA</p><h1 id="help-page-title">{content.title}</h1><span>{content.intro}</span></div>
          </header>
          <div className="help-page__content">
            <div className="help-page__body">
              <h2 className="help-page__section-title">{content.sectionTitle}</h2>
              <div className="help-page__questions" ref={questionsRef}>
                {content.questions.map(([question, answer], index) => {
                  const isOpen = index === openQuestion;
                  return (
                    <article className={isOpen ? "is-open" : ""} key={question}>
                      <button type="button" onClick={(event) => toggleQuestion(index, event)} aria-expanded={isOpen}>
                        <span>{question}</span><ChevronDown20Regular aria-hidden="true" />
                      </button>
                      {isOpen && <p>{answer}</p>}
                    </article>
                  );
                })}
              </div>
            </div>
            <ContactCard />
          </div>
        </div>
      </div>
    </section>
  );
}
function NotFound({ page }) { const content = helpPages[page]; if (content) return <HelpPage content={content} page={page} />; return <section className="route-not-found"><h1>Página no encontrada</h1><p>La página que buscas todavía no está disponible.</p></section>; }
export default NotFound;
