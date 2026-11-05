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
import { useStore } from "../context/StoreContext";
import "../styles/ProductSection.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

function ProductSection({ title, subtitle, products, onViewAll }) {
  const trackRef = useRef(null);
  const addFeedbackTimeout = useRef(null);
  const [addedProductId, setAddedProductId] = useState(null);
  const { favorites, addToCart, toggleFavorite } = useStore();

  useEffect(() => () => window.clearTimeout(addFeedbackTimeout.current), []);

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
    <section className="product-section" aria-label={title}>
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
