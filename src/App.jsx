import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import DetailProduct from "./pages/DetailProduct";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
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
  );
}

export default App;








