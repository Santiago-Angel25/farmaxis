import { useEffect, useRef } from "react";
import gsap from "gsap";
import headShoulders from "../assets/head&shoulders.webp";
import profuundaNosotras from "../assets/profuundaNosotras.webp";
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
      id="promociones"
      className="promo-section"
      aria-label="Sección de promociones"
    >
      <div className="promo-layout">
        <PromoCarousel />

        <div className="promo-side-banners" aria-label="Promociones secundarias">
          <aside className="promo-feature promo-feature--head-shoulders">
            <img
              src={headShoulders}
              alt="Promoción de productos Head & Shoulders"
            />
          </aside>

          <aside className="promo-feature promo-feature--nosotras">
            <img
              src={profuundaNosotras}
              alt="Promoción de productos Nosotras"
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

export default PromoSection;


