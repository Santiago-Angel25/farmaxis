import { useEffect, useRef, useState } from "react";
import { Badge, Button, Divider, Input, Tooltip } from "@fluentui/react-components";
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
  const spacerRef = useRef(null);
  const categoriesRef = useRef(null);
  const categoriesTrackRef = useRef(null);
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
    }, 90);
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
        )
        .fromTo(
          ".navbar__divider",
          { autoAlpha: 0, scaleY: 0 },
          { autoAlpha: 1, scaleY: 1, duration: 0.3 },
          "-=0.22",
        )
        .fromTo(
          ".navbar__search-submit",
          { autoAlpha: 0, scale: 0.55 },
          { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)" },
          "-=0.42",
        )
        .fromTo(
          ".navbar__cart-badge",
          { scale: 0, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2.6)" },
          "-=0.3",
        );
    }, headerRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    const categories = categoriesRef.current;
    const track = categoriesTrackRef.current;
    const spacer = spacerRef.current;
    if (!categories || !track || !spacer) return undefined;

    const open = categoriasOpen;
    const dropdownHeight = categories.getBoundingClientRect().height || 52;
    const nextSection = spacer.nextElementSibling;
    const gap = nextSection
      ? parseFloat(getComputedStyle(nextSection).marginTop) || 0
      : 0;

    const trackTween = open
      ? gsap.fromTo(
          track,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            overwrite: true,
          },
        )
      : gsap.to(track, {
          autoAlpha: 0,
          duration: 0.14,
          ease: "power2.in",
          overwrite: true,
        });

    const items = categories.querySelectorAll(".navbar__category");
    const itemsTween = open
      ? gsap.fromTo(
          items,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.045,
            ease: "power2.out",
            overwrite: "auto",
          },
        )
      : gsap.to(items, {
          autoAlpha: 0,
          duration: 0.1,
          ease: "power1.in",
          overwrite: "auto",
        });

    const chevron = categories.parentElement?.querySelector(
      ".navbar__option-icon--chevron",
    );
    const chevronTween = chevron
      ? gsap.to(chevron, {
          rotation: open ? 180 : 0,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        })
      : null;

    const spacingTween = gsap.to(spacer, {
      paddingBottom: open
        ? Math.max(0, dropdownHeight + ESPACIO_PROMOCIONES - gap)
        : 0,
      duration: open ? 0.45 : 0.14,
      ease: open ? "power3.out" : "power2.in",
      overwrite: true,
    });

    return () => {
      trackTween.kill();
      itemsTween.kill();
      chevronTween?.kill();
      spacingTween.kill();
    };
  }, [categoriasOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    const handleScroll = () => {
      gsap.to(header, {
        boxShadow:
          window.scrollY > 8
            ? "0 12px 32px rgba(8, 30, 53, 0.28)"
            : "0 0 0 rgba(8, 30, 53, 0)",
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
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

  const conMovimiento = () =>
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const hoverLogo = (event) => {
    if (!conMovimiento()) return;
    gsap.to(event.currentTarget, {
      scale: 1.04,
      transformOrigin: "left center",
      duration: 0.4,
      ease: "back.out(2)",
      overwrite: "auto",
    });
  };

  const salirLogo = (event) => {
    if (!conMovimiento()) return;
    gsap.to(event.currentTarget, {
      scale: 1,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const hoverBuscador = (event) => {
    if (!conMovimiento()) return;
    const input = event.currentTarget.querySelector(".navbar__search-input");
    if (!input) return;
    gsap.to(input, {
      y: -2,
      boxShadow: "0 8px 20px rgba(8, 30, 53, 0.14)",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const salirBuscador = (event) => {
    if (!conMovimiento()) return;
    const input = event.currentTarget.querySelector(".navbar__search-input");
    if (!input) return;
    gsap.to(input, {
      y: 0,
      boxShadow: "0 0 0 rgba(8, 30, 53, 0)",
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const hoverBotonBuscar = (event) => {
    if (!conMovimiento()) return;
    gsap.to(event.currentTarget, {
      scale: 1.08,
      duration: 0.25,
      ease: "back.out(2.4)",
      overwrite: "auto",
    });
  };

  const salirBotonBuscar = (event) => {
    if (!conMovimiento()) return;
    gsap.to(event.currentTarget, {
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const hoverOpcion = (event) => {
    if (!conMovimiento()) return;
    const icon = event.currentTarget.querySelector(".navbar__option-icon");
    if (icon) {
      gsap.to(icon, {
        scale: 1.25,
        duration: 0.3,
        ease: "back.out(2.4)",
        overwrite: "auto",
      });
    }
  };

  const salirOpcion = (event) => {
    if (!conMovimiento()) return;
    const icon = event.currentTarget.querySelector(".navbar__option-icon");
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const hoverMenu = (event) => {
    if (!conMovimiento()) return;
    const chevron = event.currentTarget.querySelector(
      ".navbar__option-icon--chevron",
    );
    if (chevron) {
      gsap.to(chevron, {
        scale: 1.2,
        duration: 0.3,
        ease: "back.out(2.4)",
        overwrite: "auto",
      });
    }
  };

  const salirMenu = (event) => {
    if (!conMovimiento()) return;
    const chevron = event.currentTarget.querySelector(
      ".navbar__option-icon--chevron",
    );
    if (chevron) {
      gsap.to(chevron, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const hoverSeparador = (event) => {
    if (!conMovimiento()) return;
    gsap.to(event.currentTarget, {
      scaleY: 1.8,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const salirSeparador = (event) => {
    if (!conMovimiento()) return;
    gsap.to(event.currentTarget, {
      scaleY: 1,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const hoverCategoria = (event) => {
    if (!conMovimiento()) return;
    gsap.to(event.currentTarget, {
      scale: 1.06,
      duration: 0.25,
      ease: "back.out(2)",
      overwrite: "auto",
    });
  };

  const salirCategoria = (event) => {
    if (!conMovimiento()) return;
    gsap.to(event.currentTarget, {
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <>
      <header className="navbar" ref={headerRef}>
        <div className="navbar__main">
          <a
            className="navbar__brand"
            href="/"
            aria-label="Farmaxis droguerías, inicio"
            onMouseEnter={hoverLogo}
            onMouseLeave={salirLogo}
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

          <div
            className="navbar__search"
            onMouseEnter={hoverBuscador}
            onMouseLeave={salirBuscador}
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
                  icon={<Search24Regular />}
                  aria-label="Buscar"
                  onClick={() => {}}
                  onMouseEnter={hoverBotonBuscar}
                  onMouseLeave={salirBotonBuscar}
                />
              }
            />
          </div>

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
              iconPosition="before"
            >
              <span>Iniciar sesión</span>
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
                  aria-label={`Favoritos, ${favorites.length} productos`}
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
                  aria-label={`Carrito, ${cartCount} productos`}
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
            <div className="navbar__options-inner">
              <Button
                className={`navbar__option navbar__option--menu${
                  categoriasOpen ? " is-open" : ""
                }`}
                appearance="subtle"
                icon={
                  <ChevronDown16Regular className="navbar__option-icon navbar__option-icon--chevron" />
                }
                iconPosition="after"
                aria-haspopup="true"
                aria-expanded={categoriasOpen}
                onMouseEnter={(event) => {
                  entrarBoton();
                  hoverMenu(event);
                }}
                onMouseLeave={(event) => {
                  salirBoton();
                  salirMenu(event);
                }}
                onFocus={entrarBoton}
                onBlur={salirBoton}
                onClick={() => setCategoriasOpen((open) => !open)}
              >
                Más categorías
              </Button>

              <Divider
                vertical
                className="navbar__divider"
                onMouseEnter={hoverSeparador}
                onMouseLeave={salirSeparador}
              />

              {ACCESOS_RAPIDOS.map(({ label, icon: Icon }) => (
                <Button
                  key={label}
                  className="navbar__option"
                  appearance="subtle"
                  icon={<Icon className="navbar__option-icon" />}
                  iconPosition="after"
                  onMouseEnter={hoverOpcion}
                  onMouseLeave={salirOpcion}
                  onClick={
                    label === "Favoritos"
                      ? () => openPanel("wishlist")
                      : undefined
                  }
                >
                  {label}
                  {label === "Favoritos" && favorites.length > 0
                    ? ` (${favorites.length})`
                    : ""}
                </Button>
              ))}
            </div>
          </div>

          <div
            className={`navbar__categories${
              categoriasOpen ? "" : " navbar__categories--oculto"
            }`}
            ref={categoriesRef}
            role="group"
            aria-label="Categorías de productos"
            onMouseEnter={entrarBarra}
            onMouseLeave={salirBarra}
          >
            <div className="navbar__categories-track" ref={categoriesTrackRef}>
              {CATEGORIAS.map((categoria) => (
                <Button
                  key={categoria}
                  className="navbar__category"
                  appearance="subtle"
                  onMouseEnter={hoverCategoria}
                  onMouseLeave={salirCategoria}
                >
                  {categoria}
                </Button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <div className="navbar__spacer" ref={spacerRef} aria-hidden="true" />
    </>
  );
}

export default Navbar;
