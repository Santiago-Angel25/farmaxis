import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Divider,
  Input,
  Tooltip,
} from "@fluentui/react-components";
import {
  Cart24Regular,
  ChevronDown16Regular,
  Heart24Regular,
  History24Regular,
  Person24Regular,
  Search24Regular,
  Tag24Regular,
  TicketDiagonal24Regular,
} from "@fluentui/react-icons";
import gsap from "gsap";
import logoFarmaxis from "../assets/logoFarmaxis.png";
import { useStore } from "../context/StoreContext";
import "../styles/Navbar.css";

const CATEGORIAS = [
  "Salud y medicamentos",
  "Belleza",
  "Cuidado del bebé",
  "Cuidado personal",
  "Dermocosmética",
  "Alimentos y bebidas",
  "Hogar, mascotas y otros",
];

const ACCESOS_RAPIDOS = [
  { label: "Favoritos", icon: Heart24Regular },
  { label: "Ofertas", icon: Tag24Regular },
  { label: "Volver a comprar", icon: History24Regular },
  { label: "Cupones", icon: TicketDiagonal24Regular },
];

const ESPACIO_PROMOCIONES = 24;

function Navbar() {
  const { cartCount, favorites, openPanel } = useStore();
  const headerRef = useRef(null);
  const categoriesRef = useRef(null);
  const menuTimerRef = useRef(null);
  const hoverBotonRef = useRef(false);
  const hoverBarraRef = useRef(false);
  const [logoError, setLogoError] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);

  const abrirCategorias = () => {
    if (menuTimerRef.current) {
      clearTimeout(menuTimerRef.current);
      menuTimerRef.current = null;
    }
    setCategoriasOpen(true);
  };

  const cerrarCategorias = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    menuTimerRef.current = setTimeout(() => {
      if (!hoverBotonRef.current && !hoverBarraRef.current) {
        setCategoriasOpen(false);
      }
    }, 400);
  };

  const entrarBoton = () => {
    hoverBotonRef.current = true;
    abrirCategorias();
  };

  const salirBoton = () => {
    hoverBotonRef.current = false;
    cerrarCategorias();
  };

  const entrarBarra = () => {
    hoverBarraRef.current = true;
    abrirCategorias();
  };

  const salirBarra = () => {
    hoverBarraRef.current = false;
    cerrarCategorias();
  };

  useEffect(
    () => () => {
      if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const context = gsap.context(() => {
      if (reduceMotion) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".navbar__brand",
          { autoAlpha: 0, y: -22 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
        )
        .fromTo(
          ".navbar__search",
          { autoAlpha: 0, y: -16, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.55 },
          "-=0.36",
        )
        .fromTo(
          ".navbar__action",
          { autoAlpha: 0, y: -12, scale: 0.85 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.08,
            ease: "back.out(1.6)",
          },
          "-=0.32",
        )
        .fromTo(
          ".navbar__option",
          { autoAlpha: 0, y: -8 },
          { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.05 },
          "-=0.28",
        );
    }, headerRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    const categories = categoriesRef.current;
    const header = headerRef.current;
    if (!categories || !header) return undefined;

    const open = categoriasOpen;
    const dropdownHeight = categories.getBoundingClientRect().height || 52;
    const nextSection = header.nextElementSibling;
    const gap = nextSection
      ? nextSection.getBoundingClientRect().top -
        header.getBoundingClientRect().bottom
      : 0;

    const tween = gsap.fromTo(
      categories,
      { autoAlpha: open ? 0 : 1, y: open ? -26 : 0 },
      {
        autoAlpha: open ? 1 : 0,
        y: open ? 0 : -26,
        duration: open ? 0.45 : 0.3,
        ease: open ? "power3.out" : "power2.in",
        overwrite: true,
      },
    );

    const spacingTween = gsap.to(header, {
      paddingBottom: open
        ? Math.max(0, dropdownHeight + ESPACIO_PROMOCIONES - gap)
        : 0,
      duration: open ? 0.45 : 0.3,
      ease: open ? "power3.out" : "power2.in",
      overwrite: true,
    });

    return () => {
      tween.kill();
      spacingTween.kill();
    };
  }, [categoriasOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fadeTo = gsap.quickTo(header, "opacity", {
      duration: 0.35,
      ease: "power2.out",
    });
    const liftTo = gsap.quickTo(header, "y", {
      duration: 0.35,
      ease: "power2.out",
    });
    const shadowTo = gsap.quickTo(header, "boxShadow", {
      duration: 0.35,
      ease: "power2.out",
    });

    let lastY = window.scrollY;

    const handleScroll = () => {
      const y = window.scrollY;
      const goingUp = y < lastY;
      lastY = y;

      shadowTo(
        y > 8
          ? "0 12px 32px rgba(8, 30, 53, 0.28)"
          : "0 0 0 rgba(8, 30, 53, 0)",
      );

      if (goingUp) {
        fadeTo(1);
        liftTo(0);
        header.classList.remove("navbar--oculto");
        return;
      }

      const fade = Math.max(0, 1 - y / 240);
      fadeTo(fade);
      liftTo(reduceMotion ? 0 : -(1 - fade) * 18);
      header.classList.toggle("navbar--oculto", fade < 0.05);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const popIcon = (event, scale = 1.2) => {
    gsap.to(event.currentTarget, {
      scale,
      duration: 0.28,
      ease: "back.out(2.4)",
      overwrite: "auto",
    });
  };

  const resetIcon = (event) => {
    gsap.to(event.currentTarget, {
      scale: 1,
      duration: 0.28,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const bumpCartBadge = () => {
    if (cartCount === 0) return;
    gsap.fromTo(
      ".navbar__cart-badge",
      { scale: 1 },
      {
        scale: 1.3,
        duration: 0.16,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
        overwrite: "auto",
      },
    );
  };

  return (
    <header className="navbar" ref={headerRef}>
      <div className="navbar__main">
        <a
          className="navbar__brand"
          href="/"
          aria-label="Farmaxis droguerías, inicio"
        >
          {logoError ? (
            <span className="navbar__brand-text">
              <span className="navbar__brand-name">
                <span>f</span>armaxis
              </span>
              <span className="navbar__brand-subtitle">droguerías</span>
            </span>
          ) : (
            <img
              className="navbar__logo"
              src={logoFarmaxis}
              alt="Farmaxis droguerías"
              onError={() => setLogoError(true)}
            />
          )}
        </a>

        <form
          className="navbar__search"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <Input
            className="navbar__search-input"
            type="search"
            size="large"
            appearance="outline"
            aria-label="Buscar productos"
            placeholder="Buscar medicamentos, cuidado personal, higiene..."
            contentBefore={<Search24Regular className="navbar__search-icon" />}
            contentAfter={
              <Button
                className="navbar__search-submit"
                appearance="primary"
                shape="square"
                type="submit"
                icon={<Search24Regular />}
                aria-label="Buscar"
              />
            }
          />
        </form>

        <div className="navbar__actions">
          <Button
            className="navbar__action navbar__action--login"
            appearance="subtle"
            icon={
              <Person24Regular
                className="navbar__action-icon"
                onMouseEnter={popIcon}
                onMouseLeave={resetIcon}
              />
            }
          >
            Iniciar sesión
          </Button>

          <div className="navbar__favorite">
            <Tooltip content="Favoritos" relationship="label" positioning="below">
              <Button
                className="navbar__action navbar__action--icon"
                appearance="subtle"
                shape="square"
                icon={
                  <Heart24Regular
                    className="navbar__action-icon"
                    onMouseEnter={popIcon}
                    onMouseLeave={resetIcon}
                  />
                }
                aria-label={"Favoritos, " + favorites.length + " productos"}
                onClick={() => openPanel("wishlist")}
              />
            </Tooltip>
            {favorites.length > 0 && (
              <Badge
                className="navbar__cart-badge"
                appearance="filled"
                color="danger"
                shape="circular"
                size="small"
                aria-hidden="true"
              >
                {favorites.length}
              </Badge>
            )}
          </div>

          <div className="navbar__cart">
            <Tooltip content="Carrito" relationship="label" positioning="below">
              <Button
                className="navbar__action navbar__action--icon navbar__action--cart"
                appearance="subtle"
                shape="square"
                icon={
                  <Cart24Regular
                    className="navbar__action-icon"
                    onMouseEnter={popIcon}
                    onMouseLeave={resetIcon}
                  />
                }
                aria-label={"Carrito, " + cartCount + " productos"}
                onClick={() => {
                  bumpCartBadge();
                  openPanel("cart");
                }}
              />
            </Tooltip>
            {cartCount > 0 && (
              <Badge
                className="navbar__cart-badge"
                appearance="filled"
                color="danger"
                shape="circular"
                size="small"
                aria-hidden="true"
              >
                {cartCount}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <nav className="navbar__options" aria-label="Accesos rápidos">
        <div className="navbar__options-track">
          <Button
            className={
              "navbar__option navbar__option--menu" +
              (categoriasOpen ? " is-open" : "")
            }
            appearance="subtle"
            icon={
              <ChevronDown16Regular className="navbar__option-icon navbar__option-icon--chevron" />
            }
            iconPosition="after"
            aria-haspopup="true"
            aria-expanded={categoriasOpen}
            onMouseEnter={entrarBoton}
            onMouseLeave={salirBoton}
            onClick={() => setCategoriasOpen((open) => !open)}
          >
            Más categorías
          </Button>

          <Divider vertical className="navbar__divider" />

          {ACCESOS_RAPIDOS.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              className="navbar__option"
              appearance="subtle"
              icon={<Icon className="navbar__option-icon" />}
              iconPosition="after"
              onClick={
                label === "Favoritos"
                  ? () => openPanel("wishlist")
                  : undefined
              }
            >
              {label}
              {label === "Favoritos" && favorites.length > 0
                ? " (" + favorites.length + ")"
                : ""}
            </Button>
          ))}
        </div>

        <div
          className="navbar__categories"
          ref={categoriesRef}
          role="group"
          aria-label="Categorías de productos"
          onMouseEnter={entrarBarra}
          onMouseLeave={salirBarra}
        >
          <div className="navbar__categories-track">
            {CATEGORIAS.map((categoria) => (
              <Button
                key={categoria}
                className="navbar__category"
                appearance="subtle"
              >
                {categoria}
              </Button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
