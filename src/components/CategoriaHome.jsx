import { useEffect, useRef } from "react";
import { Button } from "@fluentui/react-components";
import {
  ArrowLeftRegular,
  ArrowRightRegular,
} from "@fluentui/react-icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/CategoriaHome.css";
import categoriaHome from "../data/categoriaHome";

gsap.registerPlugin(ScrollTrigger);



function QuickLinksCarousel() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const scrollTrack = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth * 0.9,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 88%",
          once: true,
        },
      });

      entrance
        .fromTo(
          ".quick-links__surface",
          { autoAlpha: 0, scale: 0.96, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
          },
        )
        .fromTo(
          ".quick-link",
          {
            autoAlpha: 0,
            y: 16,
            rotateX: 18,
            scale: 0.88,
            filter: "blur(7px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.62,
            stagger: 0.075,
            ease: "back.out(1.5)",
          },
          "-=0.36",
        )
        .fromTo(
          ".quick-link__icon",
          { rotate: -12, scale: 0.72 },
          {
            rotate: 0,
            scale: 1,
            duration: 0.62,
            stagger: 0.075,
            ease: "elastic.out(1, 0.55)",
          },
          "-=0.48",
        );
    });

    const refreshScrollTriggers = () => ScrollTrigger.refresh();
    const refreshFrame = window.requestAnimationFrame(refreshScrollTriggers);
    window.addEventListener("load", refreshScrollTriggers, { once: true });

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      window.removeEventListener("load", refreshScrollTriggers);
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="quick-links"
      aria-label="Accesos rápidos"
    >
      <div className="quick-links__surface">
        <Button
          className="quick-links__arrow"
          appearance="subtle"
          shape="circular"
          icon={<ArrowLeftRegular />}
          aria-label="Ver accesos anteriores"
          onClick={() => scrollTrack(-1)}
        />

        <div className="quick-links__viewport" ref={trackRef}>
          {categoriaHome.map(({ label, icon: Icon }) => (
            <button className="quick-link" key={label} type="button">
              <span className="quick-link__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="quick-link__label">{label}</span>
            </button>
          ))}
        </div>

        <Button
          className="quick-links__arrow"
          appearance="subtle"
          shape="circular"
          icon={<ArrowRightRegular />}
          aria-label="Ver más accesos"
          onClick={() => scrollTrack(1)}
        />
      </div>
    </section>
  );
}

export default QuickLinksCarousel;
