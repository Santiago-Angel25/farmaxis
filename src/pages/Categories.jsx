import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import gsap from "gsap";
import ProductSection from "../components/ProductSection";
import featuredProducts from "../data/featuredProducts";
import HeadShoulders from "../data/HeadShoulders";
import higene from "../data/higene";
import RochePosay from "../data/RochePosay";
import bebidasAlimentos from "../data/bebidasAlimentos";
import BondiBoost from "../data/BondiBoost";
import Elvive from "../data/Elvive";
import Gison from "../data/Gison";
import JabonPears from "../data/JabonPears";
import Lumene from "../data/Lumene";
import Pampers from "../data/Pampers";
import ProzisOmega3 from "../data/ProzisOmega3";
import Supergoop from "../data/Supergoop";
import useCatalogProducts from "../hooks/useCatalogProducts";
import "../styles/Categories.css";

const hygieneProducts = [...higene.flat(), ...JabonPears.flat()].map((product) => ({ ...product, id: `higiene-${product.id}` }));
const rochePosayProducts = RochePosay.flat().map((product) => ({ ...product, id: `roche-posay-${product.id}` }));
const blockerProducts = [...rochePosayProducts, ...Supergoop.flat()].filter((product) => product.subcategory === "bloqueador");
const localCatalogProducts = [
  ...featuredProducts,
  ...bebidasAlimentos,
  ...HeadShoulders.flat(),
  ...hygieneProducts,
  ...rochePosayProducts,
  ...BondiBoost.flat(),
  ...Elvive.flat(),
  ...Gison.flat(),
  ...Lumene.flat(),
  ...Pampers.flat(),
  ...ProzisOmega3.flat(),
  ...Supergoop.flat(),
];
const videoBrandProducts = {
  "bondi-boost": BondiBoost.flat(),
  elvive: Elvive.flat(),
  gison: Gison.flat(),
  "jabon-pears": JabonPears.flat(),
  "la-roche-posay": rochePosayProducts,
  lumene: Lumene.flat(),
  nosotras: hygieneProducts,
  pampers: Pampers.flat(),
  "prozis-omega-3": ProzisOmega3.flat(),
  supergoop: Supergoop.flat(),
};

const videoBrandTitles = {
  "bondi-boost": "Bondi Boost",
  elvive: "Elvive",
  gison: "Gison",
  "jabon-pears": "Jabón Pears",
  "la-roche-posay": "Bloqueador · La Roche-Posay",
  lumene: "Lumene",
  nosotras: "Higiene femenina · Nosotras",
  pampers: "Pampers",
  "prozis-omega-3": "Prozis Omega 3",
  supergoop: "Bloqueador · Supergoop!",
};



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
  shampoo: "Shampoo",
  jabones: "Jabones",
  maquillaje: "Maquillaje",
};

const formatCop = (value) => `$ ${new Intl.NumberFormat("es-CO").format(value)}`;
const normalizeSearch = (value) => String(value ?? "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function matchesSearch(product, query) {
  return [product.name, product.brand, product.category, product.subcategory, product.activeIngredient, product.description]
    .some((value) => normalizeSearch(value).includes(query));
}

function getSectionProducts(section, apiProducts) {
  if (section === "featured") {
    return apiProducts.filter((product) => ["beauty", "skin-care"].includes(product.category));
  }
  if (section === "food") return bebidasAlimentos;
  if (section === "health") return featuredProducts;
  if (section === "personal-care") {
    return apiProducts.filter((product) => ["beauty", "skin-care"].includes(product.category));
  }
  return [...featuredProducts, ...bebidasAlimentos, ...apiProducts];
}

function matchesCategory(product, category) {
  if (category === "all") return true;
  if (category === "cuidado-personal") return ["cuidado-personal", "beauty", "skin-care"].includes(product.category);
  if (category === "maquillaje") return product.category === "beauty";
  if (category === "groceries") return ["groceries", "bebidas y alimentos"].includes(product.category);
  return product.category === category;
}

function Categories() {
  const { products, loading, error } = useCatalogProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortBy, setSortBy] = useState("recommended");
  const [personalOpen, setPersonalOpen] = useState(searchParams.get("category") === "shampoo" || searchParams.get("brand") === "head-shoulders" || searchParams.get("category") === "cuidado-personal" || ["cuidado-facial", "bloqueador", "lumene"].includes(searchParams.get("subcategory")));
  const [shampooOpen, setShampooOpen] = useState(searchParams.get("category") === "shampoo" || ["head-shoulders", "bondi-boost", "gison", "elvive"].includes(searchParams.get("brand")));
  const [hygieneOpen, setHygieneOpen] = useState(searchParams.get("category") === "higiene" || ["higiene-femenina", "jabones"].includes(searchParams.get("subcategory")));
  const [facialOpen, setFacialOpen] = useState(["cuidado-facial", "bloqueador", "lumene"].includes(searchParams.get("subcategory")));
  const [blockerOpen, setBlockerOpen] = useState(searchParams.get("subcategory") === "bloqueador" || ["supergoop", "la-roche-posay"].includes(searchParams.get("brand")));
  const resultsRef = useRef(null);
  const hasMountedRef = useRef(false);
  const section = searchParams.get("section");
  const brand = searchParams.get("brand");
  const category = searchParams.get("category") || "all";
  const subcategory = searchParams.get("subcategory");
  const searchQuery = normalizeSearch(searchParams.get("search")?.trim());
  const title = searchQuery
    ? `Resultados para “${searchParams.get("search")?.trim()}”`
    :
    videoBrandTitles[brand] ||
    (brand === "head-shoulders" ? "Shampoo · Head & Shoulders" : subcategory === "higiene-femenina" ? "Higiene femenina" : subcategory === "jabones" ? "Jabones" : subcategory === "elvive" ? "Elvive" : subcategory === "bloqueador" ? "Bloqueador" : subcategory === "cuidado-facial" ? "Cuidado facial" : category !== "all"
      ? FILTERS.find((filter) => filter.value === category)?.label || "Categorías"
      : SECTION_TITLES[section] || "Todos los productos");

  const visibleProducts = useMemo(() => {
    let result = searchQuery
      ? [...new Map([...localCatalogProducts, ...products].map((product) => [normalizeSearch(product.name), product])).values()]
      : category === "shampoo" ? [...HeadShoulders.flat(), ...BondiBoost.flat(), ...Gison.flat().filter((product) => product.category === "shampoo"), ...Elvive.flat()] : category === "higiene" ? [...featuredProducts.filter((product) => product.category === "higiene"), ...hygieneProducts] : category === "vitaminas" ? [...featuredProducts.filter((product) => product.category === "vitaminas"), ...ProzisOmega3.flat()] : (category === "groceries" || section === "food" ? bebidasAlimentos : getSectionProducts(section, products)).filter((product) => matchesCategory(product, category));
    if (category === "skin-care") result = [...result, ...Gison.flat().filter((product) => product.category === "skin-care")];
    if (category === "cuidado-del-bebe") result = [...result, ...Pampers.flat()];
    if (category === "cuidado-personal") result = [...result, ...HeadShoulders.flat(), ...blockerProducts, ...BondiBoost.flat(), ...Elvive.flat(), ...Gison.flat()];
    if (brand && brand === "head-shoulders") result = HeadShoulders.flat();
    if (subcategory === "cuidado-facial") result = [...products.filter((product) => product.category === "skin-care"), ...featuredProducts.filter((product) => [6, 7].includes(product.id)), ...blockerProducts, ...Gison.flat().filter((product) => product.category === "skin-care")];
    if (subcategory === "bloqueador") result = [...featuredProducts.filter((product) => product.name === "Protector Solar FPS 50+"), ...blockerProducts, ...products.filter((product) => product.category === "skin-care" && /sunscreen|sunblock|sun protection|bloqueador|protector solar|spf/i.test(product.name))];
    if (subcategory === "higiene-femenina") result = hygieneProducts.filter((product) => product.category === "cuidado femenino");
    if (subcategory === "jabones") result = hygieneProducts.filter((product) => product.subcategory === "jabones");
    if (subcategory === "elvive") result = Elvive.flat();
    if (brand && ["la-roche-posay", "supergoop"].includes(brand)) result = blockerProducts.filter((product) => product.brand === brand);
    else if (brand === "gison") result = category === "shampoo" ? Gison.flat().filter((product) => product.category === "shampoo") : videoBrandProducts[brand];
    else if (brand && videoBrandProducts[brand]) result = videoBrandProducts[brand];
    if (searchQuery) result = result.filter((product) => matchesSearch(product, searchQuery));
    result = result.filter((product) => product.price <= maxPrice);
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, section, category, brand, subcategory, maxPrice, sortBy, searchQuery]);

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
  }, [category, section, brand, subcategory, maxPrice, sortBy]);

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
            {FILTERS.map((filter) => filter.value === "cuidado-personal" ? (
              <div className="category-catalog__tree" key={filter.value}>
                <div className="category-catalog__tree-row">
                  <button className={`category-catalog__tree-label${category === filter.value || personalOpen ? " is-selected" : ""}`} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "cuidado-personal"); setSearchParams(next); }}>
                    {filter.label}
                  </button>
                  <button className="category-catalog__tree-expander" type="button" aria-label={personalOpen ? "Contraer Cuidado personal" : "Expandir Cuidado personal"} aria-expanded={personalOpen} onClick={() => setPersonalOpen((open) => !open)}>{personalOpen ? "−" : "+"}</button>
                </div>
                {personalOpen && <div className="category-catalog__tree-level">
                  <div className="category-catalog__tree-row">
                    <button className={`category-catalog__tree-label${category === "shampoo" ? " is-selected" : ""}`} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "shampoo"); setSearchParams(next); }}>{"Shampoo"}</button>
                    <button className="category-catalog__tree-expander" type="button" aria-label={shampooOpen ? "Contraer marcas de shampoo" : "Expandir marcas de shampoo"} aria-expanded={shampooOpen} onClick={() => setShampooOpen((open) => !open)}>{shampooOpen ? "−" : "+"}</button>
                  </div>
                  {shampooOpen && <div className="category-catalog__tree-level category-catalog__tree-level--brands">
                    <button className={brand === "head-shoulders" ? "is-selected" : ""} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "shampoo"); next.set("brand", "head-shoulders"); setSearchParams(next); }}>
                      Head &amp; Shoulders
                    </button>
                    <button className={brand === "bondi-boost" ? "is-selected" : ""} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "shampoo"); next.set("brand", "bondi-boost"); setSearchParams(next); }}>
                      Bondi Boost
                    </button>
                    <button className={brand === "gison" ? "is-selected" : ""} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "shampoo"); next.set("brand", "gison"); setSearchParams(next); }}>Gison</button>
                    <button className={brand === "elvive" ? "is-selected" : ""} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "shampoo"); next.set("subcategory", "elvive"); next.set("brand", "elvive"); setSearchParams(next); }}>Elvive</button>
                  </div>}
                  <button className={`category-catalog__tree-label${category === "maquillaje" ? " is-selected" : ""}`} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "maquillaje"); setSearchParams(next); }}>Maquillaje</button>
                  <div className="category-catalog__tree-row">
                    <button className={`category-catalog__tree-label${subcategory === "cuidado-facial" || subcategory === "bloqueador" || subcategory === "lumene" ? " is-selected" : ""}`} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "cuidado-personal"); next.set("subcategory", "cuidado-facial"); setSearchParams(next); setFacialOpen(true); }}>Cuidado facial</button>
                    <button className="category-catalog__tree-expander" type="button" aria-label={facialOpen ? "Contraer filtros de cuidado facial" : "Expandir filtros de cuidado facial"} aria-expanded={facialOpen} onClick={() => setFacialOpen((open) => !open)}>{facialOpen ? "−" : "+"}</button>
                  </div>
                  {facialOpen && <div className="category-catalog__tree-level category-catalog__tree-level--brands">
                    <div className="category-catalog__tree-row">
                      <button className={`category-catalog__tree-label${subcategory === "bloqueador" ? " is-selected" : ""}`} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "cuidado-personal"); next.set("subcategory", "bloqueador"); setSearchParams(next); setBlockerOpen(true); }}>Bloqueador</button>
                      <button className="category-catalog__tree-expander" type="button" aria-label={blockerOpen ? "Contraer marcas de bloqueador" : "Expandir marcas de bloqueador"} aria-expanded={blockerOpen} onClick={() => setBlockerOpen((open) => !open)}>{blockerOpen ? "−" : "+"}</button>
                    </div>
                    {blockerOpen && <div className="category-catalog__tree-level category-catalog__tree-level--brands">
                      <button className={brand === "supergoop" ? "is-selected" : ""} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "cuidado-personal"); next.set("subcategory", "bloqueador"); next.set("brand", "supergoop"); setSearchParams(next); }}>Supergoop!</button>
                      <button className={brand === "la-roche-posay" ? "is-selected" : ""} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "cuidado-personal"); next.set("subcategory", "bloqueador"); next.set("brand", "la-roche-posay"); setSearchParams(next); }}>La Roche-Posay</button>
                    </div>}
                    <button className={subcategory === "lumene" ? "is-selected" : ""} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "cuidado-personal"); next.set("subcategory", "lumene"); next.set("brand", "lumene"); setSearchParams(next); }}>Lumene</button>
                  </div>}
                </div>}
              </div>
            ) : filter.value === "higiene" ? (
              <div className="category-catalog__tree" key={filter.value}>
                <div className="category-catalog__tree-row">
                  <button className={`category-catalog__tree-label${category === filter.value || hygieneOpen ? " is-selected" : ""}`} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "higiene"); setSearchParams(next); }}>
                    {filter.label}
                  </button>
                  <button className="category-catalog__tree-expander" type="button" aria-label={hygieneOpen ? "Contraer subcategorías de higiene" : "Expandir subcategorías de higiene"} aria-expanded={hygieneOpen} onClick={() => setHygieneOpen((open) => !open)}>{hygieneOpen ? "−" : "+"}</button>
                </div>
                {hygieneOpen && <div className="category-catalog__tree-level category-catalog__tree-level--brands">
                  <button className={subcategory === "jabones" ? "is-selected" : ""} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "higiene"); next.set("subcategory", "jabones"); setSearchParams(next); }}>Jabones</button>
                  <button className={subcategory === "higiene-femenina" ? "is-selected" : ""} type="button" onClick={() => { const next = new URLSearchParams(); next.set("category", "higiene"); next.set("subcategory", "higiene-femenina"); setSearchParams(next); }}>
                    Cuidado femenino
                  </button>
                </div>}
              </div>
            ) : (
              <button className={category === filter.value ? "is-selected" : ""} type="button" key={filter.value} onClick={() => selectCategory(filter.value)}>
                {filter.label}
              </button>
            ))}
          </fieldset>
          <fieldset>
            <legend>Precio (COP)</legend>
            <div className="category-catalog__price-range">
              <div className="category-catalog__price-values"><span>{formatCop(0)}</span><output htmlFor="catalog-price-range">{formatCop(maxPrice)}</output></div>
              <input
                id="catalog-price-range"
                type="range"
                min="0"
                max="200000"
                step="1000"
                value={maxPrice}
                style={{ "--price-progress": `${(maxPrice / 200000) * 100}%` }}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                aria-label="Precio máximo"
                aria-valuetext={`Hasta ${formatCop(maxPrice)} pesos`}
              />
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







