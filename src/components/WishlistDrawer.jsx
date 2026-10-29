import { useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { DismissRegular, HeartRegular, ShoppingBagAddRegular } from "@fluentui/react-icons";
import { useStore } from "../context/StoreContext";
import "../styles/StoreDrawers.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

function WishlistDrawer() {
  const {
    activePanel,
    closePanel,
    openPanel,
    favorites,
    removeFavorite,
    addToCart,
  } = useStore();
  const open = activePanel === "wishlist";

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

  if (!open) return null;

  return (
    <div
      className="store-drawer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePanel();
      }}
    >
      <aside className="store-drawer" role="dialog" aria-modal="true" aria-labelledby="wishlist-drawer-title">
        <header className="store-drawer__header">
          <h2 id="wishlist-drawer-title">Favoritos <span>({favorites.length})</span></h2>
          <Button appearance="subtle" icon={<DismissRegular />} aria-label="Cerrar lista de deseos" onClick={closePanel} />
        </header>
        <div className="store-drawer__body">
          {favorites.length === 0 ? (
            <div className="store-drawer__empty">
              <HeartRegular />
              <p>Tu lista de deseos está vacía.</p>
              <Button appearance="primary" onClick={closePanel}>Ver productos</Button>
            </div>
          ) : (
            <ul className="store-drawer__items store-drawer__items--wishlist">
              {favorites.map((product) => (
                <li className="store-drawer-item" key={product.id}>
                  <div className="store-drawer-item__image">
                    {product.image ? <img src={product.image} alt="" /> : <span>IMAGEN</span>}
                  </div>
                  <div className="store-drawer-item__content">
                    <strong>{product.name}</strong>
                    <span className="store-drawer-item__price">{formatPrice(product.price)}</span>
                    <div className="store-drawer-item__wishlist-actions">
                      <Button
                        size="small"
                        appearance="primary"
                        icon={<ShoppingBagAddRegular />}
                        onClick={() => {
                          addToCart(product);
                          removeFavorite(product.id);
                          openPanel("cart");
                        }}
                      >
                        Agregar al carrito
                      </Button>
                      <button className="store-drawer-item__remove" type="button" onClick={() => removeFavorite(product.id)}>Quitar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

export default WishlistDrawer;

