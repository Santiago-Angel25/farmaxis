import { Button, Dialog, DialogSurface } from "@fluentui/react-components";
import {
  AddRegular,
  Cart24Regular,
  CheckmarkCircleRegular,
  DismissRegular,
  LockClosedRegular,
  SubtractRegular,
  VehicleTruckRegular,
} from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import logoFooter from "../assets/logoFooter.png";
import "../styles/ProductDetailsDialog.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

function ProductDetailsDialog({ product, onClose }) {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useStore();
  const [added, setAdded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const cartQuantity = cartItems.find(
    (item) => item.product.id === product?.id && item.product.category === product?.category,
  )?.quantity ?? 0;
  const remainingQuantity = Math.max(0, 15 - cartQuantity);
  const limitReached = remainingQuantity === 0;
  // El resumen bajo el precio ya muestra esto; no se repite en "Detalles del producto".
  const summary = product?.description || product?.details || "";

  useEffect(() => {
    setSelectedQuantity(1);
    setAdded(false);
  }, [product?.id, product?.category]);

  useEffect(() => {
    setSelectedQuantity((current) => Math.min(current, Math.max(1, remainingQuantity)));
  }, [remainingQuantity]);

  const add = () => {
    if (limitReached) {
      setAdded(false);
      return;
    }
    addToCart(product, Math.min(selectedQuantity, remainingQuantity));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
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
            <header className="product-details-dialog__brand">
              <img src={logoFooter} alt="Farmaxis Droguerías" />
            </header>
            <Button
              className="product-details-dialog__close"
              appearance="subtle"
              icon={<DismissRegular />}
              aria-label="Cerrar detalle del producto"
              onClick={onClose}
            />
            <div className="product-details-dialog__body">
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
                <span className="product-details-dialog__category">{product.category || "Producto Farmaxis"}</span>
                <h2 id="product-details-title">{product.name}</h2>
                <p className="product-details-dialog__availability">{product.availability || "Envío disponible"}</p>
                <div className="product-details-dialog__rating" aria-label="Calificación de demostración">
                  ★★★★★ <span>(Producto de demostración)</span>
                </div>
                <p className="product-details-dialog__price">
                  {formatPrice(product.price)}
                  {product.previousPrice && <del>{formatPrice(product.previousPrice)}</del>}
                </p>
                {summary && <p className="product-details-dialog__summary">{summary}</p>}
                <div className="product-details-dialog__benefits" aria-label="Beneficios de compra">
                  <span><CheckmarkCircleRegular />Producto original</span>
                  <span><VehicleTruckRegular />Envío disponible</span>
                  <span><LockClosedRegular />Compra segura</span>
                </div>
                <span className="product-details-dialog__quantity-label">Cantidad</span>
                <div className="product-details-dialog__quantity">
                  <Button
                    appearance="subtle"
                    aria-label="Disminuir cantidad"
                    icon={<SubtractRegular />}
                    onClick={() => setSelectedQuantity((current) => Math.max(1, current - 1))}
                    disabled={selectedQuantity <= 1}
                  />
                  <span aria-live="polite">{selectedQuantity}</span>
                  <Button
                    appearance="subtle"
                    aria-label="Aumentar cantidad"
                    icon={<AddRegular />}
                    onClick={() => setSelectedQuantity((current) => current + 1)}
                    disabled={limitReached || selectedQuantity >= remainingQuantity}
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
            </div>
          </div>
        )}
      </DialogSurface>
    </Dialog>
  );
}

export default ProductDetailsDialog;
