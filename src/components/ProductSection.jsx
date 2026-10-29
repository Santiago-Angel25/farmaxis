import { useEffect, useRef } from "react";
import { Button } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowLeftRegular,
  ArrowRightRegular,
  Cart24Regular,
  Delete24Regular,
  SubtractRegular,
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

function ProductSection({
  id,
  title,
  subtitle,
  products,
  onViewAll,
  showDiscount = false,
  layout = "carousel",
  hideHeader = false,
}) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const {
    favorites,
    cartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    toggleFavorite,
  } = useStore();
  const productsToDisplay = products;

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
          { autoAlpha: 0, y: 22, filter: "blur(7px)" },
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

  const handleRemoveFromCard = (productId, event) => {
    const quantityControl = event.currentTarget.closest(
      ".product-card__quantity",
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!quantityControl || reduceMotion) {
      removeFromCart(productId);
      return;
    }

    gsap.to(quantityControl, {
      autoAlpha: 0,
      scale: 0.86,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => removeFromCart(productId),
    });
  };

  const scrollTrack = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className="product-section"
      aria-label={title}
    >
      {!hideHeader && <header className="product-section__header">
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
      </header>}

      <div className={`product-section__carousel${layout === "grid" ? " product-section__carousel--grid" : ""}`}>
        <Button
          appearance="subtle"
          shape="circular"
          icon={<ArrowLeftRegular />}
          aria-label={`Productos anteriores de ${title}`}
          onClick={() => scrollTrack(-1)}
        />
        <div className={`product-section__track${layout === "grid" ? " product-section__track--grid" : ""}`} ref={trackRef}>
          {productsToDisplay.map((product) => {
            const isFavorite = favorites.some((item) => item.id === product.id);
            const quantity =
              cartItems.find((item) => item.product.id === product.id)
                ?.quantity ?? 0;

            return (
              <article className="product-card" key={product.id}>
                <div className="product-card__visual">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <span>IMAGEN</span>
                  )}
                  {showDiscount && product.discount && (
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
                        ? `Quitar ${product.name} de favoritos`
                        : `Agregar ${product.name} a favoritos`
                    }
                    aria-pressed={isFavorite}
                    onClick={() => toggleFavorite(product)}
                  />
                </div>
                <div className="product-card__details">
                  <h3>{product.name}</h3>
                  <strong>{formatPrice(product.price)}</strong>
                  {showDiscount && product.discount && product.previousPrice && (
                    <span className="product-card__previous-price">
                      {formatPrice(product.previousPrice)}
                    </span>
                  )}
                  <span className="product-card__availability">
                    {product.availability ?? "Consulta disponibilidad"}
                  </span>

                  {quantity === 0 ? (
                    <Button
                      className="product-card__add"
                      appearance="primary"
                      icon={<Cart24Regular />}
                      aria-label={`Agregar ${product.name} al carrito`}
                      onClick={() => addToCart(product)}
                    >
                      Agregar
                    </Button>
                  ) : (
                    <div
                      className="product-card__quantity"
                      aria-label={`Cantidad de ${product.name}: ${quantity}`}
                    >
                      <Button
                        className="product-card__quantity-button product-card__quantity-button--delete"
                        appearance="subtle"
                        shape="circular"
                        icon={
                          quantity === 1 ? <Delete24Regular /> : <SubtractRegular />
                        }
                        aria-label={
                          quantity === 1
                            ? `Quitar ${product.name} del carrito`
                            : `Disminuir cantidad de ${product.name}`
                        }
                        onClick={(event) =>
                          quantity === 1
                            ? handleRemoveFromCard(product.id, event)
                            : updateCartQuantity(product.id, quantity - 1)
                        }
                      />
                      <span
                        className="product-card__quantity-value"
                        key={quantity}
                        aria-live="polite"
                      >
                        {quantity}
                      </span>
                      <Button
                        className="product-card__quantity-button product-card__quantity-button--add"
                        appearance="primary"
                        shape="circular"
                        icon={<AddRegular />}
                        aria-label={`Agregar otra unidad de ${product.name}`}
                        onClick={() =>
                          updateCartQuantity(product.id, quantity + 1)
                        }
                      />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <Button
          appearance="subtle"
          shape="circular"
          icon={<ArrowRightRegular />}
          aria-label={`Ver más productos de ${title}`}
          onClick={() => scrollTrack(1)}
        />
      </div>
    </section>
  );
}

export default ProductSection;
