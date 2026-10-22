import { createContext, useCallback, useContext, useMemo, useState } from "react";

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
      const existing = current.find((item) => item.product.id === product.id);
      return existing
        ? current.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...current, { product, quantity: 1 }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((current) =>
      current.filter((item) => item.product.id !== productId),
    );
  }, []);

  const toggleFavorite = useCallback((product) => {
    setFavorites((current) =>
      current.some((item) => item.id === product.id)
        ? current.filter((item) => item.id !== product.id)
        : [...current, product],
    );
  }, []);

  const removeFavorite = useCallback((productId) => {
    setFavorites((current) => current.filter((item) => item.id !== productId));
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

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore debe usarse dentro de StoreProvider.");
  return store;
}
