import { useEffect, useRef } from "react";
import { Button } from "@fluentui/react-components";
import {
  ArrowLeftRegular,
  ArrowRightRegular,
} from "@fluentui/react-icons";
import gsap from "gsap";
import "../styles/CategoriaHome.css";
import categoriaHome from "../data/categoriaHome";

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
    const section = sectionRef.current;
    if (!section) return undefined;

    let context;
    let frame = 0;
    let hasScrolled = window.scrollY > 0;
    let removeScrollListener;
    context = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) return;

      const surface = section.querySelector(".quick-links__surface");
      const links = section.querySelectorAll(".quick-link");
      const icons = section.querySelectorAll(".quick-link__icon");

      gsap.set(surface, { scale: 0.99, filter: "blur(1px)" });
      gsap.set(links, { y: 8, rotateX: 6, scale: 0.98, filter: "blur(1px)" });
      gsap.set(icons, { rotate: -8, scale: 0.9 });

      const entrance = gsap.timeline({ paused: true });
      entrance
        .to(surface, {
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        })
        .to(links, {
          y: 0,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.35)",
        }, "-=0.3");

      entrance.to(icons, {
        rotate: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "elastic.out(1, 0.6)",
      }, "-=0.55");

      const updateAnimation = () => {
        frame = 0;
        if (!hasScrolled) return;

        const bounds = section.getBoundingClientRect();
        const inView = bounds.top < window.innerHeight * 0.86 &&
          bounds.bottom > window.innerHeight * 0.14;
        if (inView) entrance.play();
        else entrance.reverse();
      };

      const onScroll = () => {
        hasScrolled = true;
        if (!frame) frame = window.requestAnimationFrame(updateAnimation);
      };

      removeScrollListener = () => {
        window.removeEventListener("scroll", onScroll);
        if (frame) window.cancelAnimationFrame(frame);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      if (hasScrolled) updateAnimation();
    }, section);

    return () => {
      removeScrollListener?.();
      context?.revert();
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
