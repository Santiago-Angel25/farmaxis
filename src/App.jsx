import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PromoSection from "./components/PromoSection";
import CategoriaHome from "./components/CategoriaHome";
import PopularVideosSection from "./components/PopularVideosSection";
import ProductSection from "./components/ProductSection";
import ProductDetail from "./components/ProductDetail";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import { AuthForm } from "./components/AuthForm";
import { StoreProvider } from "./context/StoreContext";
import featuredProducts from "./data/featuredProducts";

function AppContent() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const navigate = useCallback((path) => {
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    setPathname(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const isRegister = pathname === "/crear-cuenta" || pathname === "/registro";
  const isLoginPage = pathname === "/iniciar-sesion" || pathname === "/login";
  const isAuthPage = isRegister || isLoginPage;
  const productMatch = pathname.match(/^\/productos\/([^/]+)\/?$/);
  const selectedProduct = productMatch
    ? featuredProducts.find((product) => product.id === decodeURIComponent(productMatch[1]))
    : null;

  return (
    <>
      <Navbar onLoginClick={() => navigate("/iniciar-sesion")} />
      <main>
        {isAuthPage ? (
          <div className="auth-page"><AuthForm mode={isRegister ? "register" : "login"} onNavigate={navigate} /></div>
        ) : productMatch ? (
          <ProductDetail product={selectedProduct} products={featuredProducts} onNavigate={navigate} />
        ) : (
          <><PromoSection /><CategoriaHome /><ProductSection title="Productos destacados" subtitle="Encuentra lo que necesitas para cuidar de ti y tu familia." products={featuredProducts} onProductClick={(product) => navigate(`/productos/${encodeURIComponent(product.id)}`)} /><PopularVideosSection /></>
        )}
      </main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
    </>
  );
}

function App() {
  return <StoreProvider><AppContent /></StoreProvider>;
}

export default App;
