import { useEffect, useRef } from "react";
import gsap from "gsap";
import CHICADORMIDA from "../assets/CHICADORMIDA06JUN.jpg";
import neutrogena from "../assets/neutrogena.jgp.webp";
import PromoCarousel from "./PromoCarousel";
import "../styles/PromoSection.css";

function PromoSection() {
  const promoSectionRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });

      entrance
        .from(".promo-carousel", { opacity: 0, y: 72, duration: 0.9 })
        .from(
          ".promo-feature",
          { opacity: 0, x: 40, duration: 0.9, stagger: 0.3 },
          "-=0.3",
        );
    }, promoSectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={promoSectionRef}
      className="promo-section"
      aria-label="Sección de promociones"
    >
      <div className="promo-layout">
        <PromoCarousel />

        <div className="promo-side-banners" aria-label="Promociones secundarias">
          <aside className="promo-feature promo-feature--cerave">
            <img
              src={neutrogena}
              alt="Promoción de productos Neutrogena Hydro Boost"
            />
          </aside>

          <aside className="promo-feature promo-feature--nosotras">
            <img
              src={CHICADORMIDA}
              alt="Promoción de toallas Nosotras Extra Protección"
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

export default PromoSection;
