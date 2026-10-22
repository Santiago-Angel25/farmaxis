import { useEffect, useRef, useState } from "react";
import { Button } from "@fluentui/react-components";
import {
  AddRegular,
  DismissRegular,
  SubtractRegular,
} from "@fluentui/react-icons";
import { useStore } from "../context/StoreContext";
import "../styles/StoreDrawers.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

function CartDrawer() {
  const {
    activePanel,
    closePanel,
    cartItems,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
  } = useStore();
  const [postalCode, setPostalCode] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [removingIds, setRemovingIds] = useState([]);
  const removeTimeouts = useRef(new Map());
  const open = activePanel === "cart";

  useEffect(
    () => () => removeTimeouts.current.forEach((timeout) => window.clearTimeout(timeout)),
    [],
  );

  const animateRemove = (productId) => {
    if (removeTimeouts.current.has(productId)) return;

    setRemovingIds((current) => [...current, productId]);
    const timeout = window.setTimeout(() => {
      removeFromCart(productId);
      setRemovingIds((current) => current.filter((id) => id !== productId));
      removeTimeouts.current.delete(productId);
    }, 220);
    removeTimeouts.current.set(productId, timeout);
  };

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closePanel();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closePanel]);

  const calculateShipping = (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(postalCode)) {
      setShippingMessage("Escribe un código postal colombiano de 6 dígitos.");
      return;
    }
    setShippingMessage(
      "Código guardado. El valor del envío se confirmará al finalizar la compra.",
    );
  };

  if (!open) return null;

  return (
    <div
      className="store-drawer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePanel();
      }}
    >
      <aside
        className="store-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="store-drawer__header">
          <h2 id="cart-drawer-title">
            Carrito de compras <span>({cartCount})</span>
          </h2>
          <Button
            appearance="subtle"
            icon={<DismissRegular />}
            aria-label="Cerrar carrito"
            onClick={closePanel}
          />
        </header>

        <div className="store-drawer__body">
          {cartItems.length === 0 ? (
            <div className="store-drawer__empty">
              <p>Tu carrito está vacío.</p>
              <Button appearance="primary" onClick={closePanel}>
                Ver productos
              </Button>
            </div>
          ) : (
            <>
              <ul className="store-drawer__items">
                {cartItems.map(({ product, quantity }) => (
                  <li
                    className={
                      "store-drawer-item" +
                      (removingIds.includes(product.id) ? " is-removing" : "")
                    }
                    key={product.id}
                  >
                    <div className="store-drawer-item__image">
                      {product.image ? (
                        <img src={product.image} alt="" />
                      ) : (
                        <span>IMAGEN</span>
                      )}
                    </div>
                    <div className="store-drawer-item__content">
                      <strong>{product.name}</strong>
                      <div className="store-drawer-item__actions">
                        <div
                          className="store-quantity"
                          aria-label={"Cantidad: " + quantity}
                        >
                          <button
                            type="button"
                            aria-label={"Quitar una unidad de " + product.name}
                            onClick={() =>
                              quantity === 1
                                ? animateRemove(product.id)
                                : updateCartQuantity(product.id, quantity - 1)
                            }
                          >
                            <SubtractRegular />
                          </button>
                          <span className="store-quantity__value" key={quantity}>
                            {quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={"Agregar una unidad de " + product.name}
                            onClick={() =>
                              updateCartQuantity(product.id, quantity + 1)
                            }
                          >
                            <AddRegular />
                          </button>
                        </div>
                        <button
                          className="store-drawer-item__remove"
                          type="button"
                          onClick={() => animateRemove(product.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                      <span className="store-drawer-item__price" key={quantity}>
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="store-drawer__totals">
                <div>
                  <span>Subtotal (sin envío):</span>
                  <strong>{formatPrice(cartSubtotal)}</strong>
                </div>
                <form className="store-shipping" onSubmit={calculateShipping}>
                  <label htmlFor="postal-code">Medios de envío</label>
                  <div>
                    <input
                      id="postal-code"
                      inputMode="numeric"
                      maxLength={6}
                      value={postalCode}
                      onChange={(event) =>
                        setPostalCode(event.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Tu código postal"
                    />
                    <Button type="submit" appearance="outline" size="small">
                      Calcular
                    </Button>
                  </div>
                  {shippingMessage && <small role="status">{shippingMessage}</small>}
                </form>
                <div className="store-drawer__grand-total">
                  <span>Total:</span>
                  <strong>{formatPrice(cartSubtotal)}</strong>
                </div>
                <p className="store-drawer__shipping-note">
                  El envío se cotiza al iniciar la compra.
                </p>
              </div>

              <Button
                className="store-drawer__checkout"
                appearance="primary"
                onClick={() =>
                  setCheckoutMessage(
                    "El carrito está listo. El proceso de pago aún debe conectarse.",
                  )
                }
              >
                Iniciar compra
              </Button>
              {checkoutMessage && (
                <p className="store-drawer__message" role="status">
                  {checkoutMessage}
                </p>
              )}
              <button
                className="store-drawer__continue"
                type="button"
                onClick={closePanel}
              >
                Ver más productos
              </button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

export default CartDrawer;
