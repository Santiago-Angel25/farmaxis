import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowLeftRegular,
  Cart24Regular,
  Delete24Regular,
  SubtractRegular,
} from "@fluentui/react-icons";
import { useStore } from "../context/StoreContext";
import "../styles/Cart.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

function Cart() {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
  } = useStore();
  const [removingIds, setRemovingIds] = useState([]);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const removeWithAnimation = (productId) => {
    if (removingIds.includes(productId)) return;
    setRemovingIds((current) => [...current, productId]);
    window.setTimeout(() => {
      removeFromCart(productId);
      setRemovingIds((current) => current.filter((id) => id !== productId));
    }, 220);
  };

  return (
    <section className="cart-page" aria-labelledby="cart-page-title">
      <div className="cart-page__heading">
        <div>
          <h1 id="cart-page-title">Carrito de compras</h1>
          <p>{cartCount} {cartCount === 1 ? "producto" : "productos"}</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-page__empty">
          <Cart24Regular aria-hidden="true" />
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos y aparecerán aquí.</p>
          <Button as="a" href="/" appearance="primary">Explorar productos</Button>
        </div>
      ) : (
        <div className="cart-page__layout">
          <div className="cart-page__items-panel">
            <div className="cart-page__table-head" aria-hidden="true">
              <span>Producto</span><span>Precio</span><span>Cantidad</span><span>Subtotal</span>
            </div>
            <ul className="cart-page__items">
              {cartItems.map(({ product, quantity }) => (
                <li
                  className={`cart-page__item${removingIds.includes(product.id) ? " is-removing" : ""}`}
                  key={product.id}
                >
                  <div className="cart-page__product">
                    <div className="cart-page__image">
                      {product.image ? <img src={product.image} alt="" /> : <span>IMG</span>}
                    </div>
                    <div className="cart-page__name">
                      <strong>{product.name}</strong>
                      <span>{formatPrice(product.price)} por unidad</span>
                    </div>
                  </div>
                  <span className="cart-page__unit-price">{formatPrice(product.price)}</span>
                  <div className="cart-page__quantity" aria-label={`Cantidad de ${product.name}: ${quantity}`}>
                    <Button
                      appearance="subtle"
                      icon={quantity === 1 ? <Delete24Regular /> : <SubtractRegular />}
                      aria-label={quantity === 1 ? `Quitar ${product.name}` : `Disminuir cantidad de ${product.name}`}
                      onClick={() => quantity === 1 ? removeWithAnimation(product.id) : updateCartQuantity(product.id, quantity - 1)}
                    />
                    <span key={quantity} aria-live="polite">{quantity}</span>
                    <Button
                      appearance="subtle"
                      icon={<AddRegular />}
                      aria-label={`Aumentar cantidad de ${product.name}`}
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                    />
                  </div>
                  <strong className="cart-page__line-total" key={`${quantity}-${product.price}`}>
                    {formatPrice(product.price * quantity)}
                  </strong>
                </li>
              ))}
            </ul>
            <Link className="cart-page__continue" to="/">
              <ArrowLeftRegular /> Seguir comprando
            </Link>
          </div>

          <aside className="cart-page__summary" aria-label="Resumen del pedido">
            <h2>Resumen del pedido</h2>
            <div><span>Subtotal</span><strong>{formatPrice(cartSubtotal)}</strong></div>
            <div><span>Envío</span><span className="cart-page__shipping">Se cotiza al finalizar</span></div>
            <div className="cart-page__total"><strong>Total</strong><strong>{formatPrice(cartSubtotal)}</strong></div>
            <p>El costo de envío se confirmará al iniciar la compra.</p>
            <Button
              appearance="primary"
              className="cart-page__checkout"
              onClick={() => setCheckoutMessage("El carrito está listo. El proceso de pago aún debe conectarse.")}
            >
              Finalizar compra
            </Button>
            {checkoutMessage && <small role="status">{checkoutMessage}</small>}
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;
