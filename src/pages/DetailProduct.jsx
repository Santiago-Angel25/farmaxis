import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@fluentui/react-components";
import { AddRegular, ArrowLeftRegular, Cart24Regular, Delete24Regular, SubtractRegular } from "@fluentui/react-icons";
import { useStore } from "../context/StoreContext";
import useCatalogProducts from "../hooks/useCatalogProducts";
import HeadShoulders from "../data/HeadShoulders";
import bebidasAlimentos from "../data/bebidasAlimentos";
import "../styles/DetailProduct.css";

const money = (value) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(value) || 0);

function DetailProduct() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { products } = useCatalogProducts();
  const { cartItems, addToCart, updateCartQuantity, removeFromCart } = useStore();
  const [added, setAdded] = useState(false);
  const pageRef = useRef(null);
  const product = state?.product || products.find((item) => String(item.id) === id) || bebidasAlimentos.find((item) => String(item.id) === id) || HeadShoulders.flat().find((item) => String(item.id) === id) || cartItems.find((item) => String(item.product.id) === id)?.product;
  const quantity = cartItems.find((item) => String(item.product.id) === id && (!product || item.product.category === product.category))?.quantity || 0;
  useEffect(() => {
    const page = pageRef.current;
    if (!page || !product || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .fromTo(".detail-product__crumbs", { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.4 })
        .fromTo(".detail-product__gallery", { autoAlpha: 0, x: -30, scale: 0.97, filter: "blur(8px)" }, { autoAlpha: 1, x: 0, scale: 1, filter: "blur(0px)", duration: 0.7 }, "-=0.12")
        .fromTo(".detail-product__info > *", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.07 }, "-=0.42")
        .fromTo(".detail-product__description", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.55 }, "-=0.12");
    }, page);

    return () => context.revert();
  }, [id, product]);

  if (!product) return <main className="detail-product detail-product--missing"><h1>Producto no encontrado</h1><Link to="/categories">Volver al catálogo</Link></main>;

  const add = () => { addToCart(product); setAdded(true); window.setTimeout(() => setAdded(false), 1100); };
  const decrement = () => quantity <= 1 ? removeFromCart(product.id, product.category) : updateCartQuantity(product.id, quantity - 1, product.category);

  return <main className="detail-product" ref={pageRef}>
    <nav className="detail-product__crumbs" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><span>/</span><Link to="/categories">Catálogo</Link><span>/</span><span>{product.name}</span></nav>
    <section className="detail-product__main">
      <div className="detail-product__gallery"><div className="detail-product__image">{product.image ? <img src={product.image} alt={product.name} /> : <span>Imagen del producto</span>}</div><div className="detail-product__thumbs">{product.image && <button type="button" aria-label="Ver imagen del producto"><img src={product.image} alt="" /></button>}</div></div>
      <div className="detail-product__info"><h1>{product.name}</h1><p className="detail-product__availability">{product.availability || "Envío disponible"}</p><div className="detail-product__rating" aria-label="Calificación de demostración">★★★★★ <span>(Producto de demostración)</span></div><div className="detail-product__price">{money(product.price)} {product.previousPrice && <del>{money(product.previousPrice)}</del>}</div><label className="detail-product__quantity-label">Cantidad</label><div className="detail-product__quantity"><Button appearance="subtle" aria-label="Disminuir cantidad" icon={quantity <= 1 ? <Delete24Regular /> : <SubtractRegular />} onClick={decrement} disabled={quantity === 0} /><span>{quantity || 1}</span><Button appearance="subtle" aria-label="Aumentar cantidad" icon={<AddRegular />} disabled={quantity >= 15} onClick={() => quantity ? updateCartQuantity(product.id, quantity + 1, product.category) : addToCart(product)} /></div><div className="detail-product__actions"><Button appearance="primary" icon={<Cart24Regular />} onClick={add}>{added ? "Agregado al carrito" : "Agregar al carrito"}</Button><Button appearance="outline" onClick={() => navigate("/cart")}>Ver carrito</Button></div></div>
    </section>
    <section className="detail-product__description"><h2>Detalles del producto</h2><dl><div><dt>Producto</dt><dd>{product.name}</dd></div><div><dt>Presentación</dt><dd>{product.description || "Consulta la presentación del producto en su empaque."}</dd></div><div><dt>Información</dt><dd>Sigue las indicaciones del fabricante.</dd></div></dl></section>
    <Link className="detail-product__back" to="/categories"><ArrowLeftRegular /> Volver al catálogo</Link>
  </main>;
}

export default DetailProduct;


