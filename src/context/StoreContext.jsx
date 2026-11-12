import { createContext, useCallback, useContext, useMemo, useState } from "react";

const MAX_PRODUCT_QUANTITY = 15;

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activePanel, setActivePanel] = useState(null);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );
  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems],
  );

  const addToCart = useCallback((product) => {
    setCartItems((current) => {
      const existing = current.find((item) =>
        item.product.id === product.id && item.product.category === product.category,
      );
      return existing
        ? current.map((item) =>
            item.product.id === product.id && item.product.category === product.category
              ? { ...item, quantity: Math.min(item.quantity + 1, MAX_PRODUCT_QUANTITY) }
              : item,
          )
        : [...current, { product, quantity: 1 }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId, quantity, category) => {
    if (quantity < 1) return;
    const cappedQuantity = Math.min(quantity, MAX_PRODUCT_QUANTITY);
    setCartItems((current) =>
      current.map((item) =>
        item.product.id === productId && (category === undefined || item.product.category === category)
          ? { ...item, quantity: cappedQuantity }
          : item,
      ),
    );
  }, []);

  const removeFromCart = useCallback((productId, category) => {
    setCartItems((current) =>
      current.filter((item) => item.product.id !== productId || (category !== undefined && item.product.category !== category)),
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const toggleFavorite = useCallback((product) => {
    setFavorites((current) =>
      current.some((item) => item.id === product.id && item.category === product.category)
        ? current.filter((item) => item.id !== product.id || item.category !== product.category)
        : [...current, product],
    );
  }, []);

  const removeFavorite = useCallback((productId, category) => {
    setFavorites((current) => current.filter((item) => item.id !== productId || (category !== undefined && item.category !== category)));
  }, []);

  const openPanel = useCallback((panel) => setActivePanel(panel), []);
  const closePanel = useCallback(() => setActivePanel(null), []);

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        favorites,
        activePanel,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleFavorite,
        removeFavorite,
        openPanel,
        closePanel,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// El provider y el hook consumidor comparten este módulo de contexto.
// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore debe usarse dentro de StoreProvider.");
  return store;
}

