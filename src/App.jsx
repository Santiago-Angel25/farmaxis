import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PromoSection from "./components/PromoSection";
import CategoriaHome from "./components/CategoriaHome";
import PopularVideosSection from "./components/PopularVideosSection";
import { AuthForm } from "./components/AuthForm";
import { StoreProvider } from "./context/StoreContext";

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

  return (
    <>
      <Navbar onLoginClick={() => navigate("/iniciar-sesion")} />
      <main>
        {isAuthPage ? (
          <div className="auth-page"><AuthForm mode={isRegister ? "register" : "login"} onNavigate={navigate} /></div>
        ) : (
          <><PromoSection /><CategoriaHome /><PopularVideosSection /></>
        )}
      </main>
      <Footer />
    </>
  );
}

function App() {
  return <StoreProvider><AppContent /></StoreProvider>;
}

export default App;
