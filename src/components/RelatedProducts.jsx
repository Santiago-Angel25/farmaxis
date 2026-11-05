import { useLayoutEffect, useMemo, useRef } from "react";
import { Button } from "@fluentui/react-components";
import { AddRegular, ArrowLeftRegular, ArrowRightRegular } from "@fluentui/react-icons";
import { gsap } from "gsap";
import { useStore } from "../context/StoreContext";
import "../styles/RelatedProducts.css";

const formatPrice = (price) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

export default function RelatedProducts({ product, products, onNavigate }) {
  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const animatingRef = useRef(false);
  const { addToCart } = useStore();

  const related = useMemo(() => {
    const others = products.filter((item) => item.id !== product.id);
    const sameCategory = others.filter((item) => item.category && item.category === product.category);
    return sameCategory.length >= 2 ? sameCategory : others;
  }, [product, products]);

  useLayoutEffect(() => {
    const viewport = trackRef.current;
    const group = viewport?.querySelector(".related-products__group");
    if (!viewport || !group) return undefined;
    viewport.scrollLeft = group.getBoundingClientRect().width;
    return () => tweenRef.current?.kill();
  }, [related.length]);

  const normalizeLoopPosition = () => {
    const viewport = trackRef.current;
    const group = viewport?.querySelector(".related-products__group");
    if (!viewport || !group) return;
    const groupWidth = group.getBoundingClientRect().width;
    if (viewport.scrollLeft < groupWidth * 0.35) viewport.scrollLeft += groupWidth;
    else if (viewport.scrollLeft > groupWidth * 1.65) viewport.scrollLeft -= groupWidth;
  };

  const moveCards = (direction) => {
    const viewport = trackRef.current;
    if (!viewport) return;
    const card = viewport.querySelector(".related-product-card");
    const group = viewport.querySelector(".related-products__group");
    const gap = Number.parseFloat(getComputedStyle(group).columnGap) || 0;
    const step = (card?.getBoundingClientRect().width || viewport.clientWidth * 0.8) + gap;
    tweenRef.current?.kill();
    animatingRef.current = true;
    tweenRef.current = gsap.to(viewport, {
      scrollLeft: viewport.scrollLeft + direction * step,
      duration: 0.55,
      ease: "power2.out",
      overwrite: true,
      onComplete: () => {
        normalizeLoopPosition();
        animatingRef.current = false;
      },
    });
  };

  if (!related.length) return null;

  return (
    <section className="related-products" aria-labelledby="related-products-title">
      <header className="related-products__header">
        <div><span>Descubre más</span><h2 id="related-products-title">También te puede interesar</h2></div>
      </header>
      <div className="related-products__carousel">
        <Button className="related-products__arrow" appearance="outline" shape="circular" icon={<ArrowLeftRegular />} aria-label="Ver productos anteriores" onClick={() => moveCards(-1)} />
        <div className="related-products__viewport" ref={trackRef} tabIndex={0} aria-label="Productos relacionados. Desliza horizontalmente para explorar más opciones." onScroll={() => { if (!animatingRef.current) normalizeLoopPosition(); }}>
          <div className="related-products__track">
            {[0, 1, 2].map((copy) => (
              <div className="related-products__group" key={copy}>
                {related.map((item) => (
                  <article className="related-product-card" key={`${copy}-${item.id}`}>
                    <button className="related-product-card__visual" type="button" onClick={() => onNavigate(`/productos/${encodeURIComponent(item.id)}`)} aria-label={`Ver ${item.name}`}>
                      {item.image ? <img src={item.image} alt="" /> : <span>IMAGEN DEL PRODUCTO</span>}
                      {item.discount > 0 && <span className="related-product-card__discount">-{item.discount}%</span>}
                    </button>
                    <div className="related-product-card__body">
                      <span className="related-product-card__category">{item.category || "Farmaxis"}</span>
                      <button className="related-product-card__name" type="button" onClick={() => onNavigate(`/productos/${encodeURIComponent(item.id)}`)}>{item.name}</button>
                      <strong>{formatPrice(item.price)}</strong>
                      {item.previousPrice && <del>{formatPrice(item.previousPrice)}</del>}
                      <Button appearance="primary" icon={<AddRegular />} onClick={() => addToCart(item)}>Agregar al carrito</Button>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
        <Button className="related-products__arrow" appearance="outline" shape="circular" icon={<ArrowRightRegular />} aria-label="Ver más productos" onClick={() => moveCards(1)} />
      </div>
      <p className="related-products__hint">Usa las flechas o desliza para explorar más opciones</p>
    </section>
  );
}
