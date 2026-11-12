import { Button, Dialog, DialogSurface } from "@fluentui/react-components";
import {
  AddRegular,
  Cart24Regular,
  DismissRegular,
  Delete24Regular,
  SubtractRegular,
} from "@fluentui/react-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import "../styles/ProductDetailsDialog.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

function ProductDetailsDialog({ product, onClose }) {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateCartQuantity, removeFromCart } = useStore();
  const [added, setAdded] = useState(false);
  const quantity = cartItems.find(
    (item) => item.product.id === product?.id && item.product.category === product?.category,
  )?.quantity ?? 0;
  const limitReached = quantity >= 15;

  const add = () => {
    if (limitReached) {
      setAdded(false);
      return;
    }
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  };

  const decrement = () => {
    if (quantity <= 1) removeFromCart(product.id, product.category);
    else updateCartQuantity(product.id, quantity - 1, product.category);
  };

  return (
    <Dialog
      open={Boolean(product)}
      onOpenChange={(_, data) => {
        if (!data.open) onClose();
      }}
      modalType="modal"
    >
      <DialogSurface className="product-details-dialog" aria-labelledby="product-details-title">
        {product && (
          <div className="product-details-dialog__content">
            <Button
              className="product-details-dialog__close"
              appearance="subtle"
              icon={<DismissRegular />}
              aria-label="Cerrar detalle del producto"
              onClick={onClose}
            />
            <section className="product-details-dialog__main">
              <div className="product-details-dialog__gallery">
                <div className="product-details-dialog__image">
                  {product.image ? <img src={product.image} alt={product.name} /> : <span>Imagen del producto</span>}
                </div>
                {product.image && (
                  <div className="product-details-dialog__thumbs">
                    <img src={product.image} alt="" />
                  </div>
                )}
              </div>

              <div className="product-details-dialog__info">
                <h2 id="product-details-title">{product.name}</h2>
                <p className="product-details-dialog__availability">{product.availability || "Envío disponible"}</p>
                <div className="product-details-dialog__rating" aria-label="Calificación de demostración">
                  ★★★★★ <span>(Producto de demostración)</span>
                </div>
                <p className="product-details-dialog__price">
                  {formatPrice(product.price)}
                  {product.previousPrice && <del>{formatPrice(product.previousPrice)}</del>}
                </p>
                <span className="product-details-dialog__quantity-label">Cantidad</span>
                <div className="product-details-dialog__quantity">
                  <Button
                    appearance="subtle"
                    aria-label="Disminuir cantidad"
                    icon={quantity <= 1 ? <Delete24Regular /> : <SubtractRegular />}
                    onClick={decrement}
                    disabled={quantity === 0}
                  />
                  <span aria-live="polite">{quantity || 1}</span>
                  <Button
                    appearance="subtle"
                    aria-label="Aumentar cantidad"
                    icon={<AddRegular />}
                    onClick={() => quantity ? updateCartQuantity(product.id, quantity + 1, product.category) : addToCart(product)}
                    disabled={limitReached}
                  />
                </div>
                {limitReached && (
                  <p className="product-details-dialog__limit" role="status" aria-live="polite">
                    Has alcanzado el máximo de 15 unidades de este producto. No puedes agregar más al carrito.
                  </p>
                )}
                <div className="product-details-dialog__actions">
                  <Button appearance="primary" icon={<Cart24Regular />} onClick={add}>
                    {added ? "Agregado al carrito" : "Agregar al carrito"}
                  </Button>
                  <Button appearance="outline" onClick={() => { onClose(); navigate("/cart"); }}>
                    Ver carrito
                  </Button>
                </div>
              </div>
            </section>

            <section className="product-details-dialog__description">
              <h3>Detalles del producto</h3>
              <dl>
                <div><dt>Producto</dt><dd>{product.name}</dd></div>
                {(product.brand || product.manufacturer) && <div><dt>Marca / Fabricante</dt><dd>{product.brand || product.manufacturer}</dd></div>}
                {product.manufacturedIn && <div><dt>Fabricado en</dt><dd>{product.manufacturedIn}</dd></div>}
                {product.category && <div><dt>Categoría</dt><dd>{product.category}</dd></div>}
                {product.presentation && <div><dt>Presentación</dt><dd>{product.presentation}</dd></div>}
                {product.activeIngredient && <div><dt>Ingrediente activo</dt><dd>{product.activeIngredient}</dd></div>}
                {product.description && <div><dt>Descripción</dt><dd>{product.description}</dd></div>}
                {product.details && <div><dt>Información</dt><dd>{product.details}</dd></div>}
              </dl>
            </section>
          </div>
        )}
      </DialogSurface>
    </Dialog>
  );
}

export default ProductDetailsDialog;
