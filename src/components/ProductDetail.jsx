import { useEffect, useRef, useState } from "react";
import { Button } from "@fluentui/react-components";
import { AddRegular, HeartFilled, HeartRegular, SubtractRegular } from "@fluentui/react-icons";
import { gsap } from "gsap";
import { useStore } from "../context/StoreContext";
import RelatedProducts from "./RelatedProducts";
import "../styles/ProductDetail.css";

const formatPrice = (price) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

export default function ProductDetail({ product, products = [], onNavigate }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const pageRef = useRef(null);
  const { addToCart, favorites, toggleFavorite } = useStore();
  const isFavorite = favorites.some((item) => item.id === product?.id);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(".product-detail__visual, .product-detail__info, .product-detail__specs", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" });
    }, pageRef);
    return () => context.revert();
  }, [product?.id]);

  if (!product) return <section className="product-detail product-detail--missing"><h1>No encontramos ese producto</h1><Button appearance="primary" onClick={() => onNavigate("/")}>Volver al inicio</Button></section>;

  const details = [
    ["Principio activo", product.activeIngredient || product.name],
    ["Presentación", product.presentation || "Presentación según empaque"],
    ["Información", product.details || product.description || "Consulta la información del fabricante."],
  ];

  return (
    <>
    <div className="product-detail" ref={pageRef}>
      <nav className="product-detail__breadcrumb" aria-label="Ruta de navegación">
        <button type="button" onClick={() => onNavigate("/")}>Inicio</button><span>/</span>
        <span>{product.category || "Productos"}</span><span>/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <section className="product-detail__overview" aria-labelledby="product-detail-title">
        <div className="product-detail__gallery">
          <div className="product-detail__visual">
            {product.image ? <img src={product.image} alt={product.name} /> : <span>IMAGEN DEL PRODUCTO</span>}
            {product.discount > 0 && <span className="product-detail__discount">-{product.discount}%</span>}
          </div>
          <div className="product-detail__thumbnails" aria-label="Imágenes del producto">
            {[0, 1, 2].map((index) => <button key={index} type="button" className={selectedImage === index ? "is-selected" : ""} aria-label={`Ver imagen ${index + 1}`} onClick={() => setSelectedImage(index)}>{product.image ? <img src={product.image} alt="" /> : <span>IMG</span>}</button>)}
          </div>
        </div>

        <div className="product-detail__info">
          <p className="product-detail__category">{product.category || "Farmacia Farmaxis"}</p>
          <h1 id="product-detail-title">{product.name}</h1>
          <p className="product-detail__presentation">{product.presentation || "Presentación según empaque"}</p>
          <div className="product-detail__rating" aria-label={`Calificación ${product.rating || 4.8} de 5, ${product.reviewCount || 128} opiniones`}><span aria-hidden="true">★★★★★</span><strong>{product.rating || "4.8"}</strong><button type="button" onClick={() => document.getElementById("product-details")?.scrollIntoView({ behavior: "smooth" })}>({product.reviewCount || 128} opiniones)</button></div>
          {product.previousPrice && <span className="product-detail__previous">Antes {formatPrice(product.previousPrice)}</span>}
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p className="product-detail__description">{product.description || "Producto seleccionado para el cuidado y bienestar de tu familia."}</p>
          <p className="product-detail__availability">{product.availability || "Consulta disponibilidad"}</p>

          <label className="product-detail__quantity-label" htmlFor="product-quantity">Cantidad</label>
          <div className="product-detail__quantity">
            <button type="button" aria-label="Quitar una unidad" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><SubtractRegular /></button>
            <output id="product-quantity" aria-live="polite">{quantity}</output>
            <button type="button" aria-label="Agregar una unidad" onClick={() => setQuantity((current) => Math.min(99, current + 1))}><AddRegular /></button>
          </div>

          <div className="product-detail__actions">
            <Button appearance="primary" className="product-detail__add" onClick={() => { addToCart(product, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1800); }}>{added ? "Agregado al carrito" : "Agregar al carrito"}</Button>
            <Button appearance="outline" className="product-detail__favorite" icon={isFavorite ? <HeartFilled /> : <HeartRegular />} aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"} aria-pressed={isFavorite} onClick={() => toggleFavorite(product)} />
          </div>
          <p className="product-detail__shipping-note">El precio y la disponibilidad pueden variar según la ubicación.</p>
        </div>
      </section>

      <section id="product-details" className="product-detail__specs" aria-labelledby="product-specs-title">
        <h2 id="product-specs-title">Detalles del producto</h2>
        <dl>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </section>
    </div>
    <RelatedProducts product={product} products={products} onNavigate={onNavigate} />
    </>
  );
}
