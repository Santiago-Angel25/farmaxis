import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import DetailProduct from "./pages/DetailProduct";
import AuthPage from "./pages/AuthPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/detailProduct/:id" element={<DetailProduct />} />
          <Route path="/iniciar-sesion" element={<AuthPage mode="login" />} />
          <Route path="/crear-cuenta" element={<AuthPage mode="register" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
