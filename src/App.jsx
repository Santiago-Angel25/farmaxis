import Navbar from "./components/Navbar";
import PromoSection from "./components/PromoSection";
import CategoriaHome from "./components/CategoriaHome";
import PopularVideosSection from "./components/PopularVideosSection";
import ProductSection from "./components/ProductSection";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import { StoreProvider } from "./context/StoreContext";
import featuredProducts from "./data/featuredProducts";
import useCatalogProducts from "./hooks/useCatalogProducts";

function App() {
  const { products, loading, error } = useCatalogProducts();

  const featuredApiProducts = products.filter((product) =>
    ["beauty", "skin-care"].includes(product.category),
  );
  const foodProducts = products.filter(
    (product) => product.category === "groceries",
  );
  const personalCareProducts = products.filter((product) =>
    ["beauty", "skin-care"].includes(product.category),
  );

  return (
    <StoreProvider>
      <Navbar />
      <PromoSection />
      <CategoriaHome />
      <PopularVideosSection />

      {loading && <p role="status">Cargando catálogo de demostración…</p>}
      {error && (
        <p role="alert">No se pudo cargar el catálogo externo: {error}</p>
      )}

      <ProductSection
        id="productos-destacados"
        title="Productos destacados"
        subtitle="Selección para ti"
        products={featuredApiProducts}
        showDiscount
      />
      <ProductSection
        id="bebidas-y-alimentos"
        title="Bebidas y alimentos"
        subtitle="Encuentra lo que necesitas"
        products={foodProducts}
      />
       <ProductSection
        id="salud-y-medicamentos"
        title="Salud y medicamentos"
        subtitle="Productos de demostración del catálogo local"
        products={featuredProducts}
      />
      <ProductSection
        id="cuidado-personal"
        title="Cuidado personal"
        subtitle="Belleza y cuidado de la piel"
        products={personalCareProducts}
      />
      <CartDrawer />
      <WishlistDrawer />
    </StoreProvider>
  );
}

export default App;





