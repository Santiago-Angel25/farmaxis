import Navbar from "./components/Navbar";
import PromoSection from "./components/PromoSection";
import CategoriaHome from "./components/CategoriaHome";
import PopularVideosSection from "./components/PopularVideosSection";
import ProductSection from "./components/ProductSection";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import { StoreProvider } from "./context/StoreContext";
import featuredProducts from "./data/featuredProducts";

function App() {
  return (
    <StoreProvider>
      <Navbar />
      <PromoSection />
      <CategoriaHome />
      <PopularVideosSection />
      <ProductSection title="Productos destacados" subtitle="Selección para ti" products={featuredProducts} />
      <CartDrawer />
      <WishlistDrawer />
    </StoreProvider>
  );
}

export default App;

