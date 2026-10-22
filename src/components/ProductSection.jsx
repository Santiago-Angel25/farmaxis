import { useEffect, useRef, useState } from "react";
import { Button } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowLeftRegular,
  ArrowRightRegular,
  CheckmarkRegular,
  HeartFilled,
  HeartRegular,
} from "@fluentui/react-icons";
import gsap from "gsap";
import { useStore } from "../context/StoreContext";
import "../styles/ProductSection.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

function ProductSection({ title, subtitle, products, onViewAll }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const addFeedbackTimeout = useRef(null);
  const [addedProductId, setAddedProductId] = useState(null);
  const { favorites, addToCart, toggleFavorite } = useStore();

  useEffect(() => () => window.clearTimeout(addFeedbackTimeout.current), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let animationContext;
    let hasPlayed = false;
    let observer;

    const playEntrance = () => {
      if (hasPlayed) return;
      hasPlayed = true;

      section.classList.add("is-entering");
      animationContext = gsap.context(() => {
        const timeline = gsap.timeline({
          onComplete: () => section.classList.remove("is-entering"),
        });

        timeline.fromTo(
          ".product-section__header",
          {
            autoAlpha: 0,
            y: 22,
            filter: "blur(7px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.65,
            ease: "power3.out",
          },
        );

        timeline.fromTo(
          ".product-section__carousel > button",
          { autoAlpha: 0, scale: 0.78 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.45,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.3",
        );

        timeline.fromTo(
          ".product-card",
          {
            autoAlpha: 0,
            y: 34,
            rotateX: 7,
            scale: 0.96,
            filter: "blur(7px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.72,
            stagger: 0.11,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility,filter",
          },
          "-=0.28",
        );

        timeline.fromTo(
          ".product-card__visual img",
          { scale: 1.07 },
          {
            scale: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "transform",
          },
          "<",
        );
      }, section);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      playEntrance();
      return () => animationContext?.revert();
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        playEntrance();
      },
      { threshold: 0.18 },
    );

    observer.observe(section);

    return () => {
      observer?.disconnect();
      animationContext?.revert();
      section.classList.remove("is-entering");
    };
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProductId(product.id);
    window.clearTimeout(addFeedbackTimeout.current);
    addFeedbackTimeout.current = window.setTimeout(
      () => setAddedProductId(null),
      1500,
    );
  };

  const scrollTrack = (direction) => {
    const track = trackRef.current;
    if (track) {
      track.scrollBy({
        left: direction * track.clientWidth * 0.85,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="product-section"
      aria-label={title}
    >
      <header className="product-section__header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <Button
          appearance="subtle"
          icon={<ArrowRightRegular />}
          iconPosition="after"
          onClick={onViewAll}
          disabled={!onViewAll}
        >
          Ver todos
        </Button>
      </header>

      <div className="product-section__carousel">
        <Button
          appearance="subtle"
          shape="circular"
          icon={<ArrowLeftRegular />}
          aria-label={"Productos anteriores de " + title}
          onClick={() => scrollTrack(-1)}
        />
        <div className="product-section__track" ref={trackRef}>
          {products.map((product) => {
            const isFavorite = favorites.some((item) => item.id === product.id);
            const wasAdded = addedProductId === product.id;

            return (
              <article className="product-card" key={product.id}>
                <div className="product-card__visual">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <span>IMAGEN</span>
                  )}
                  {product.discount && (
                    <span className="product-card__discount">
                      -{product.discount}%
                    </span>
                  )}
                  <Button
                    className={
                      "product-card__favorite" +
                      (isFavorite ? " is-favorite" : "")
                    }
                    appearance="subtle"
                    shape="circular"
                    icon={isFavorite ? <HeartFilled /> : <HeartRegular />}
                    aria-label={
                      isFavorite
                        ? "Quitar " + product.name + " de favoritos"
                        : "Agregar " + product.name + " a favoritos"
                    }
                    aria-pressed={isFavorite}
                    onClick={() => toggleFavorite(product)}
                  />
                </div>
                <div className="product-card__details">
                  <h3>{product.name}</h3>
                  <strong>{formatPrice(product.price)}</strong>
                  {product.previousPrice && (
                    <span className="product-card__previous-price">
                      {formatPrice(product.previousPrice)}
                    </span>
                  )}
                  <span className="product-card__availability">
                    {product.availability ?? "Consulta disponibilidad"}
                  </span>
                  <Button
                    className={
                      "product-card__add" + (wasAdded ? " is-added" : "")
                    }
                    appearance="primary"
                    icon={wasAdded ? <CheckmarkRegular /> : <AddRegular />}
                    aria-label={
                      wasAdded
                        ? product.name + " agregado al carrito"
                        : "Agregar " + product.name + " al carrito"
                    }
                    onClick={() => handleAddToCart(product)}
                  >
                    {wasAdded ? "Agregado al carrito" : "Agregar"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
        <Button
          appearance="subtle"
          shape="circular"
          icon={<ArrowRightRegular />}
          aria-label={"Ver más productos de " + title}
          onClick={() => scrollTrack(1)}
        />
      </div>
    </section>
  );
}

export default ProductSection;
