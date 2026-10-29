import { useNavigate } from "react-router-dom";
import PromoSection from "../components/PromoSection";
import CategoriaHome from "../components/CategoriaHome";
import PopularVideosSection from "../components/PopularVideosSection";
import ProductSection from "../components/ProductSection";
import featuredProducts from "../data/featuredProducts";
import useCatalogProducts from "../hooks/useCatalogProducts";

function Home() {
  const navigate = useNavigate();
  const { products, loading, error } = useCatalogProducts();
  const featuredApiProducts = products.filter((product) => [
    "beauty", "skin-care"].includes(product.category));
  const foodProducts = products.filter(
    (product) => product.category === "groceries");
  const personalCareProducts = products.filter(
    (product) => ["beauty", "skin-care"].includes(product.category));

  return (
    <>
      <PromoSection />
      <CategoriaHome />
      <PopularVideosSection />
      {loading && <p role="status">Cargando catálogo de demostración…</p>}
      {error && <p role="alert">No se pudo cargar el catálogo externo: {error}</p>}
      <ProductSection id="productos-destacados" title="Productos destacados" subtitle="Selección para ti" products={featuredApiProducts} showDiscount onViewAll={() => navigate("/categories?section=featured")} />
      <ProductSection id="bebidas-y-alimentos" title="Bebidas y alimentos" subtitle="Encuentra lo que necesitas" products={foodProducts} onViewAll={() => navigate("/categories?section=food")} />
      <ProductSection id="salud-y-medicamentos" title="Salud y medicamentos" subtitle="Productos de demostración del catálogo local" products={featuredProducts} onViewAll={() => navigate("/categories?section=health")} />
      <ProductSection id="cuidado-personal" title="Cuidado personal" subtitle="Belleza y cuidado de la piel" products={personalCareProducts} onViewAll={() => navigate("/categories?section=personal-care")} />
    </>
  );
}

export default Home;