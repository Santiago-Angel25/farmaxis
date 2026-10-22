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

const PRODUCTOS_EN_CARRITO = 2;

/* Espacio en blanco que queda entre el desplegable y las promociones */
const ESPACIO_PROMOCIONES = 24;

function Navbar() {
  const headerRef = useRef(null);
  const spacerRef = useRef(null);
  const categoriesRef = useRef(null);
  const categoriesTrackRef = useRef(null);
  const menuTimerRef = useRef(null);
  const hoverBotonRef = useRef(false);
  const hoverBarraRef = useRef(false);
  const [logoError, setLogoError] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);

  /* La barra de categorías se abre al pasar el mouse y se cierra al salir.
     Se controla con dos banderas (botón y barra) porque al mover el puntero
     de uno al otro React dispara leave/enter en un orden que no se puede
     predecir, y el cierre se programa igual. */
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

  /* Entrada animada del navbar (GSAP) */
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

  /* Barra horizontal de categorías: aparece/desaparece con animación (GSAP).
     Además empuja el contenido hacia abajo para dejar espacio con las
     promociones en vez de superponerse a ellas.

     Ojo: la animación va sobre la BARRA (categories-track) y no sobre el
     contenedor. El contenedor es la zona que mantiene abierto el desplegable
     y nunca debe moverse: si se moviera, al pasar el cursor a "Favoritos"
     la barra se metería bajo el ratón, volvería a abrirse y el desplegable
     parpadearía. */
  useEffect(() => {
    const categorias = categoriesRef.current;
    const barra = categoriesTrackRef.current;
    const spacer = spacerRef.current;
    if (!categorias || !barra || !spacer) return undefined;

    const abierto = categoriasOpen;
    const altoDesplegable = categorias.getBoundingClientRect().height || 52;

    /* Cuánto hueco hay ya entre el navbar y el contenido de abajo
       (por ejemplo, el margen de la sección de promociones) */
    const siguiente = spacer.nextElementSibling;
    const holgura = siguiente
      ? parseFloat(getComputedStyle(siguiente).marginTop) || 0
      : 0;

    const tween = abierto
      ? gsap.fromTo(
          barra,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            overwrite: true,
          },
        )
      : gsap.to(barra, {
          autoAlpha: 0,
          duration: 0.14,
          ease: "power2.in",
          overwrite: true,
        });

    /* Los botones de categoría entran escalonados (uno detrás de otro) */
    const items = categorias.querySelectorAll(".navbar__category");
    const itemsTween = abierto
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

    /* El chevron de "Más categorías" gira 180° con GSAP */
    const chevron = categorias.parentElement?.querySelector(
      ".navbar__option-icon--chevron",
    );
    const chevronTween = chevron
      ? gsap.to(chevron, {
          rotation: abierto ? 180 : 0,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        })
      : null;

    /* El desplegable empuja el contenido: así queda un espacio en blanco
       entre las categorías y las promociones de abajo */
    const espacioTween = gsap.to(spacer, {
      paddingBottom: abierto
        ? Math.max(0, altoDesplegable + ESPACIO_PROMOCIONES - holgura)
        : 0,
      duration: abierto ? 0.45 : 0.14,
      ease: abierto ? "power3.out" : "power2.in",
      overwrite: true,
    });

    return () => {
      tween.kill();
      itemsTween.kill();
      if (chevronTween) chevronTween.kill();
      espacioTween.kill();
    };
  }, [categoriasOpen]);

  /* Sombra del navbar fijo al hacer scroll (GSAP) */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    const handleScroll = () => {
      const y = window.scrollY;

      gsap.to(header, {
        boxShadow:
          y > 8
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

  /* Micro-interacciones hover sobre los iconos (GSAP) */
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

  /* ---------- Micro-interacciones hover con GSAP ----------
     Una por elemento del navbar: logo, buscador, botón de buscar,
     accesos rápidos, separador y botones de categoría. */

  const conMovimiento = () =>
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Logo: crece un poco al pasar el ratón */
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

  /* Buscador: se levanta y gana una sombra suave.
     El handler va en el contenedor porque el Input de Fluent no reenvía
     los eventos al DOM: se anima el input de dentro. */
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

  /* Botón "Buscar": pequeño rebote */
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

  /* Accesos rápidos de la franja azul: el icono crece.
     OJO: no se mueve el botón (solo se escala), porque si el botón se
     desplazara podría sacar al puntero de su interior y provocar parpadeos */
  const hoverOpcion = (event) => {
    if (!conMovimiento()) return;
    const icono = event.currentTarget.querySelector(".navbar__option-icon");
    if (icono) {
      gsap.to(icono, {
        scale: 1.25,
        duration: 0.3,
        ease: "back.out(2.4)",
        overwrite: "auto",
      });
    }
  };

  const salirOpcion = (event) => {
    if (!conMovimiento()) return;
    const icono = event.currentTarget.querySelector(".navbar__option-icon");
    if (icono) {
      gsap.to(icono, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  /* "Más categorías": el chevron crece
     (la rotación del chevron la anima GSAP en el efecto del desplegable) */
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

  /* Separador vertical: se estira al pasar el ratón */
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

  /* Botones de categoría del desplegable (solo escala: no se desplazan
     para no sacar al puntero del botón y provocar parpadeos) */
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
          {/* Logo (tu PNG en src/assets/logoFarmaxis.png) */}
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

          {/* Buscador */}
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
              contentBefore={
                <Search24Regular className="navbar__search-icon" />
              }
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

          {/* Inicio de sesión, favoritos y carrito */}
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
              Iniciar sesión
            </Button>

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
                aria-label="Favoritos"
              />
            </Tooltip>

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
                  aria-label={`Carrito, ${PRODUCTOS_EN_CARRITO} productos`}
                  onMouseEnter={bumpCartBadge}
                />
              </Tooltip>

              <Badge
                className="navbar__cart-badge"
                appearance="filled"
                color="danger"
                shape="circular"
                size="small"
                aria-hidden="true"
              >
                {PRODUCTOS_EN_CARRITO}
              </Badge>
            </div>
          </div>
        </div>

        {/* Barra de accesos rápidos */}
        <nav className="navbar__options" aria-label="Accesos rápidos">
          <div className="navbar__options-track">
            {/* Grupo de accesos: centrado en la franja azul */}
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
                onClick={entrarBoton}
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
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Barra horizontal de categorías (se despliega al pasar el mouse) */}
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

      {/* Espacio que deja el navbar fijo en el flujo de la página */}
      <div className="navbar__spacer" ref={spacerRef} aria-hidden="true" />
    </>
  );
}

export default Navbar;
