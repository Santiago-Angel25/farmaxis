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
  const categoriesRef = useRef(null);
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
        );
    }, headerRef);

    return () => context.revert();
  }, []);

  /* Barra horizontal de categorías: aparece/desaparece con animación (GSAP) */
  useEffect(() => {
    const categorias = categoriesRef.current;
    const header = headerRef.current;
    if (!categorias || !header) return undefined;

    const abierto = categoriasOpen;
    const altoDesplegable = categorias.getBoundingClientRect().height || 52;

    /* Cuánto hueco hay ya entre el navbar y el contenido de abajo
       (por ejemplo, el margen de la sección de promociones) */
    const siguiente = header.nextElementSibling;
    const holgura = siguiente
      ? siguiente.getBoundingClientRect().top -
        header.getBoundingClientRect().bottom
      : 0;

    const tween = gsap.fromTo(
      categorias,
      { autoAlpha: abierto ? 0 : 1, y: abierto ? -26 : 0 },
      {
        autoAlpha: abierto ? 1 : 0,
        y: abierto ? 0 : -26,
        duration: abierto ? 0.45 : 0.3,
        ease: abierto ? "power3.out" : "power2.in",
        overwrite: true,
      },
    );

    /* El desplegable empuja el contenido: así queda un espacio en blanco
       entre las categorías y las promociones de abajo */
    const espacioTween = gsap.to(header, {
      paddingBottom: abierto
        ? Math.max(0, altoDesplegable + ESPACIO_PROMOCIONES - holgura)
        : 0,
      duration: abierto ? 0.45 : 0.3,
      ease: abierto ? "power3.out" : "power2.in",
      overwrite: true,
    });

    return () => {
      tween.kill();
      espacioTween.kill();
    };
  }, [categoriasOpen]);

  /* Sombra + desvanecimiento progresivo del navbar al hacer scroll (GSAP) */
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
        /* Al subir vuelve a verse completo */
        fadeTo(1);
        liftTo(0);
        header.classList.remove("navbar--oculto");
        return;
      }

      /* Al bajar se desvanece poco a poco */
      const fade = Math.max(0, 1 - y / 240);
      fadeTo(fade);
      liftTo(reduceMotion ? 0 : -(1 - fade) * 18);

      /* Cuando ya no se ve, deja de interceptar los clics del contenido */
      header.classList.toggle("navbar--oculto", fade < 0.05);
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

  return (
    <header className="navbar" ref={headerRef}>
      <div className="navbar__main">
        {/* Lado izquierdo: logo (tu PNG en src/assets/logoFarmaxis.png) */}
        <a className="navbar__brand" href="/" aria-label="Farmaxis droguerías, inicio">
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

        {/* Centro: buscador */}
        <div className="navbar__search">
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
              />
            }
          />
        </div>

        {/* Lado derecho: inicio de sesión, favoritos y carrito */}
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
            onMouseEnter={entrarBoton}
            onMouseLeave={salirBoton}
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
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Barra horizontal de categorías (se despliega al pasar el mouse) */}
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
