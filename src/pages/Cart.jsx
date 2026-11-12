import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@fluentui/react-components";
import { AddRegular, ArrowLeftRegular, Cart24Regular, CheckmarkCircle24Regular, Delete24Regular, SubtractRegular } from "@fluentui/react-icons";
import { gsap } from "gsap";
import { useStore } from "../context/StoreContext";
import "../styles/Cart.css";

const formatPrice = (price) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(price) || 0);

function downloadInvoice(invoice) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const rows = invoice.items.map(({ product, quantity }) => `<tr><td><strong>${escapeHtml(product.name)}</strong><small>${quantity} ${quantity === 1 ? "unidad" : "unidades"}</small></td><td>${escapeHtml(formatPrice(product.price * quantity))}</td></tr>`).join("");
  printWindow.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Factura Farmaxis</title><style>
    *{box-sizing:border-box}body{margin:0;background:#f5f7f9;color:#1b3146;font:15px Arial,sans-serif}.receipt{width:min(100%,620px);min-height:100vh;margin:0 auto;padding:56px 58px;background:white;box-shadow:0 8px 34px #0b213812}.brand{text-align:center;padding-bottom:38px}.brand b{display:block;color:#0b2138;font-size:40px;letter-spacing:-2px}.brand small{color:#5581a0;font-size:10px;letter-spacing:4px}.meta{display:flex;justify-content:space-between;gap:15px;padding:16px 0;border-top:1px solid #dfe7ed;border-bottom:1px solid #dfe7ed;color:#657789;font-size:12px}.products{margin:24px 0 44px}table{width:100%;border-collapse:collapse}td{padding:16px 0;border-bottom:1px dashed #dce4e9;vertical-align:top}td:last-child{text-align:right;white-space:nowrap;font-weight:700}td small{display:block;margin-top:6px;color:#81909e;font-size:12px}.summary{color:#82909b}.summary div{display:flex;justify-content:space-between;margin:12px 0}.summary .total{margin-top:16px;padding-top:14px;border-top:1px solid #dfe7ed;color:#0b2138;font-size:24px;font-weight:bold}.seal{display:grid;width:94px;height:94px;margin:42px auto 20px;place-content:center;border:2px solid #85bad5;border-radius:50%;color:#287eaa;text-align:center;font-size:11px;font-weight:bold;line-height:1.4;transform:rotate(-10deg)}footer{text-align:center;color:#8493a0;font-size:12px;line-height:1.5}.print{display:block;margin:24px auto;padding:13px 28px;border:0;border-radius:8px;background:#0b2138;color:white;font-size:14px;font-weight:bold;cursor:pointer}@page{size:A4;margin:18mm}@media print{body{background:#fff}.receipt{width:100%;min-height:0;margin:0;padding:12mm 15mm;box-shadow:none}.print{display:none}.brand{padding-bottom:24px}.products{margin-bottom:32px}}
    </style></head><body><main class="receipt"><header class="brand"><b>farmaxis</b><small>DROGUERÍAS · SALUD Y BIENESTAR</small></header><div class="meta"><span>COLOMBIA</span><span>${escapeHtml(invoice.generatedAt)}</span></div><section class="products"><table><tbody>${rows}</tbody></table></section><section class="summary"><div><span>Subtotal</span><span>${escapeHtml(formatPrice(invoice.total))}</span></div><div><span>Envío</span><span>Por confirmar</span></div><div class="total"><span>TOTAL</span><span>${escapeHtml(formatPrice(invoice.total))}</span></div></section><div class="seal">FARMAXIS<br>COMPRA<br>EXITOSA</div><footer>Gracias por confiar en Farmaxis.<br>Cuidamos de ti y de tu familia.</footer><button class="print" onclick="window.print()">Imprimir / Guardar como PDF</button></main><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250))</script></body></html>`);
  printWindow.document.close();
}

function Cart() {
  const { cartItems, cartCount, cartSubtotal, updateCartQuantity, removeFromCart } = useStore();
  const [removingIds, setRemovingIds] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const removeWithAnimation = (product) => {
    const productKey = `${product.category}:${product.id}`;
    if (removingIds.includes(productKey)) return;
    setRemovingIds((current) => [...current, productKey]);
    window.setTimeout(() => { removeFromCart(product.id, product.category); setRemovingIds((current) => current.filter((key) => key !== productKey)); }, 220);
  };

  useEffect(() => {
    if (!invoice || !modalRef.current) return undefined;
    const context = gsap.context(() => {
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.24, ease: "power2.out" });
      gsap.fromTo(contentRef.current, { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.48, ease: "back.out(1.5)" });
      gsap.fromTo(".checkout-modal__success-mark", { scale: 0, rotate: -25 }, { scale: 1, rotate: 0, duration: 0.55, delay: 0.12, ease: "back.out(2)" });
    }, modalRef);
    return () => context.revert();
  }, [invoice]);

  useEffect(() => {
    if (!invoice) return undefined;
    const onKeyDown = (event) => { if (event.key === "Escape") setInvoice(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [invoice]);

  const finishCheckout = () => {
    if (!cartItems.length) return;
    setShowInvoice(false);
    setInvoice({ items: cartItems.map(({ product, quantity }) => ({ product: { ...product }, quantity })), total: cartSubtotal, generatedAt: new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeStyle: "short" }).format(new Date()) });
  };

  return (
    <section className="cart-page" aria-labelledby="cart-page-title">
      <div className="cart-page__heading"><div><h1 id="cart-page-title">Carrito de compras</h1><p>{cartCount} {cartCount === 1 ? "producto" : "productos"}</p></div></div>
      {cartItems.length === 0 ? <div className="cart-page__empty"><Cart24Regular aria-hidden="true" /><h2>Tu carrito está vacío</h2><p>Agrega productos y aparecerán aquí.</p><Button as="a" href="/" appearance="primary">Explorar productos</Button></div> : (
        <div className="cart-page__layout">
          <div className="cart-page__items-panel">
            <div className="cart-page__table-head" aria-hidden="true"><span>Producto</span><span>Precio</span><span>Cantidad</span><span>Subtotal</span></div>
            <ul className="cart-page__items">{cartItems.map(({ product, quantity }) => <li className={`cart-page__item${removingIds.includes(`${product.category}:${product.id}`) ? " is-removing" : ""}`} key={`${product.category}:${product.id}`}>
              <div className="cart-page__product"><div className="cart-page__image">{product.image ? <img src={product.image} alt="" /> : <span>IMG</span>}</div><div className="cart-page__name"><strong>{product.name}</strong><span>{formatPrice(product.price)} por unidad</span></div></div>
              <span className="cart-page__unit-price">{formatPrice(product.price)}</span>
              <div className="cart-page__quantity" aria-label={`Cantidad de ${product.name}: ${quantity}`}><Button appearance="subtle" icon={quantity === 1 ? <Delete24Regular /> : <SubtractRegular />} aria-label={quantity === 1 ? `Quitar ${product.name}` : `Disminuir cantidad de ${product.name}`} onClick={() => quantity === 1 ? removeWithAnimation(product) : updateCartQuantity(product.id, quantity - 1, product.category)} /><span key={quantity} aria-live="polite">{quantity}</span><Button appearance="subtle" icon={<AddRegular />} disabled={quantity >= 15} aria-label={`Aumentar cantidad de ${product.name}`} onClick={() => updateCartQuantity(product.id, quantity + 1, product.category)} /></div>
              <strong className="cart-page__line-total" key={`${quantity}-${product.price}`}>{formatPrice(product.price * quantity)}</strong>
            </li>)}</ul>
            <Link className="cart-page__continue" to="/"><ArrowLeftRegular /> Seguir comprando</Link>
          </div>
          <aside className="cart-page__summary" aria-label="Resumen del pedido"><h2>Resumen del pedido</h2><div><span>Subtotal</span><strong>{formatPrice(cartSubtotal)}</strong></div><div><span>Envío</span><span className="cart-page__shipping">Se cotiza al finalizar</span></div><div className="cart-page__total"><strong>Total</strong><strong>{formatPrice(cartSubtotal)}</strong></div><p>El costo de envío se confirmará al iniciar la compra.</p><Button appearance="primary" className="cart-page__checkout" onClick={finishCheckout}>Finalizar compra</Button></aside>
        </div>
      )}
      {invoice && <div className="checkout-modal" ref={modalRef} onMouseDown={(event) => { if (event.target === modalRef.current) setInvoice(null); }}>
        <section className={`checkout-modal__content${showInvoice ? " is-invoice-view" : ""}`} ref={contentRef} role="dialog" aria-modal="true" aria-labelledby="checkout-modal-title">
          <button className="checkout-modal__close" type="button" onClick={() => setInvoice(null)} aria-label="Cerrar">×</button>
          {!showInvoice ? <><div className="checkout-modal__success-mark"><CheckmarkCircle24Regular /></div><p className="checkout-modal__eyebrow">FARMAXIS · DROGUERÍAS</p><h2 id="checkout-modal-title">¡Compra exitosa!</h2><p className="checkout-modal__intro">Tu compra quedó registrada. Ya puedes consultar o descargar tu factura.</p><div className="checkout-modal__actions"><Button appearance="primary" onClick={() => downloadInvoice(invoice)}>Descargar factura</Button><Button appearance="secondary" onClick={() => setShowInvoice(true)}>Ver factura aquí</Button></div><small>Generada el {invoice.generatedAt}</small></> : <><div className="invoice-preview__brand"><span>farmaxis</span><small>DROGUERÍAS · SALUD Y BIENESTAR</small></div><div className="invoice-preview__meta"><span>COLOMBIA</span><span>{invoice.generatedAt}</span></div><div className="invoice-preview__heading"><div><p>DETALLE DE TU COMPRA</p><h2 id="checkout-modal-title">Gracias por tu compra</h2></div><span className="invoice-preview__badge">EXITOSA</span></div><div className="invoice-preview__table">{invoice.items.map(({ product, quantity }) => <div className="invoice-preview__row" key={`${product.category}:${product.id}`}><span><strong>{product.name}</strong><small>{quantity} {quantity === 1 ? "unidad" : "unidades"} · {formatPrice(product.price)} c/u</small></span><strong>{formatPrice(product.price * quantity)}</strong></div>)}</div><div className="invoice-preview__summary"><div><span>Subtotal</span><span>{formatPrice(invoice.total)}</span></div><div><span>Envío</span><span>Por confirmar</span></div><div className="invoice-preview__total"><span>TOTAL</span><strong>{formatPrice(invoice.total)}</strong></div></div><div className="invoice-preview__seal">FARMAXIS<br />COMPRA<br />EXITOSA</div><p className="invoice-preview__thanks">Gracias por confiar en Farmaxis.<br />Cuidamos de ti y de tu familia.</p><div className="checkout-modal__actions"><Button appearance="primary" onClick={() => downloadInvoice(invoice)}>Descargar factura</Button><Button appearance="secondary" onClick={() => setShowInvoice(false)}>Volver</Button></div></>}
        </section>
      </div>}
    </section>
  );
}

export default Cart;

