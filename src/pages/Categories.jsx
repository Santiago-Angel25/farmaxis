import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import gsap from "gsap";
import ProductSection from "../components/ProductSection";
import featuredProducts from "../data/featuredProducts";
import useCatalogProducts from "../hooks/useCatalogProducts";
import "../styles/Categories.css";

const FILTERS = [
  { label: "Todos los productos", value: "all" },
  { label: "Medicamentos", value: "medicamentos" },
  { label: "Vitaminas", value: "vitaminas" },
  { label: "Belleza", value: "beauty" },
  { label: "Dermocosmética", value: "skin-care" },
  { label: "Cuidado personal", value: "cuidado-personal" },
  { label: "Cuidado del bebé", value: "cuidado-del-bebe" },
  { label: "Hogar, mascotas y otros", value: "otros" },
  { label: "Higiene", value: "higiene" },
  { label: "Alimentos y bebidas", value: "groceries" },
];

const SECTION_TITLES = {
  featured: "Productos destacados",
  food: "Bebidas y alimentos",
  health: "Salud y medicamentos",
  "personal-care": "Cuidado personal",
};

function getSectionProducts(section, apiProducts) {
  if (section === "featured") {
    return apiProducts.filter((product) => ["beauty", "skin-care"].includes(product.category));
  }
  if (section === "food") return apiProducts.filter((product) => product.category === "groceries");
  if (section === "health") return featuredProducts;
  if (section === "personal-care") {
    return apiProducts.filter((product) => ["beauty", "skin-care"].includes(product.category));
  }
  return [...featuredProducts, ...apiProducts];
}

function matchesCategory(product, category) {
  if (category === "all") return true;
  if (category === "cuidado-personal") return ["cuidado-personal", "beauty", "skin-care"].includes(product.category);
  if (category === "groceries") return product.category === "groceries";
  return product.category === category;
}

function Categories() {
  const { products, loading, error } = useCatalogProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const resultsRef = useRef(null);
  const hasMountedRef = useRef(false);
  const section = searchParams.get("section");
  const category = searchParams.get("category") || "all";
  const title = category !== "all"
    ? FILTERS.find((filter) => filter.value === category)?.label || "Categorías"
    : SECTION_TITLES[section] || "Todos los productos";

  const visibleProducts = useMemo(() => {
    let result = getSectionProducts(section, products).filter((product) => matchesCategory(product, category));
    if (minPrice !== "") result = result.filter((product) => product.price >= Number(minPrice));
    if (maxPrice !== "") result = result.filter((product) => product.price <= Number(maxPrice));
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, section, category, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return undefined;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const cards = resultsRef.current?.querySelectorAll(".product-card");
    if (!cards?.length) return undefined;

    const animation = gsap.context(() => {
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 14, scale: 0.975, filter: "blur(4px)" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.38,
          stagger: 0.035,
          ease: "power2.out",
          clearProps: "transform,opacity,visibility,filter",
        },
      );
    }, resultsRef);

    return () => animation.revert();
  }, [category, section, minPrice, maxPrice, sortBy]);

  const selectCategory = (value) => {
    const next = new URLSearchParams();
    if (value !== "all") next.set("category", value);
    setSearchParams(next);
  };

  return (
    <div className="category-catalog">
      <div className="category-catalog__heading">
        <div>
          <h1>{title}</h1>
          <p>{visibleProducts.length} productos</p>
        </div>
        <label className="category-catalog__sort">
          Ordenar:
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="recommended">Recomendados</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
          </select>
        </label>
      </div>

      <div className="category-catalog__layout">
        <aside className="category-catalog__filters" aria-label="Filtros de productos">
          <h2>Filtrar</h2>
          <fieldset>
            <legend>Categoría</legend>
            {FILTERS.map((filter) => (
              <button
                className={category === filter.value ? "is-selected" : ""}
                type="button"
                key={filter.value}
                onClick={() => selectCategory(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </fieldset>
          <fieldset>
            <legend>Precio (COP)</legend>
            <div className="category-catalog__price-inputs">
              <label><span className="visually-hidden">Precio mínimo</span><input inputMode="numeric" placeholder="$ 0" value={minPrice} onChange={(event) => setMinPrice(event.target.value.replace(/\D/g, ""))} /></label>
              <label><span className="visually-hidden">Precio máximo</span><input inputMode="numeric" placeholder="$ Sin límite" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value.replace(/\D/g, ""))} /></label>
            </div>
          </fieldset>
        </aside>

        <section className="category-catalog__results" aria-label={title} ref={resultsRef}>
          {loading && <p role="status">Cargando catálogo…</p>}
          {error && <p role="alert">No se pudo cargar el catálogo externo: {error}</p>}
          {!loading && visibleProducts.length === 0 ? (
            <p className="category-catalog__empty">No encontramos productos con estos filtros.</p>
          ) : (
            <ProductSection title={title} products={visibleProducts} layout="grid" hideHeader showDiscount={visibleProducts.some((product) => Number(product.discount) > 0)} />
          )}
        </section>
      </div>
    </div>
  );
}

export default Categories;