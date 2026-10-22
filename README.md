# Farmaxis

Tienda de droguerías construida con **React 19 + Vite**, **Fluent UI React** (componentes e iconos), **GSAP** (animaciones) y **CSS puro** (todo el diseño vive en `src/styles/*.css`, sin estilos inline en el JSX).

## Poner / cambiar tu logo (PNG)

El navbar carga el logo desde `src/assets/logoFarmaxis.png`. Para usar el tuyo o cambiarlo:

1. Copia tu archivo PNG a `C:\Users\Salma\farmaxis\src\assets\logoFarmaxis.png` (reemplaza el archivo actual).
2. Listo: Vite recarga el navbar al instante, no hace falta reiniciar el servidor ni recargar con Ctrl + F5.

Detalles:

- El logo se muestra con `object-fit: contain`, así que se respeta la proporción de tu imagen (tu PNG actual mide 1570×672 px).
- El `alt` y el enlace del logo ya están configurados; si la imagen no llegara a cargarse, el navbar muestra automáticamente el logo de texto "farmaxis droguerías" (no queda una imagen rota).

## Comportamiento del navbar

- **Navbar fijo**: el header está anclado arriba de la ventana (`position: fixed`) y **siempre visible** (nunca se desvanece al hacer scroll). Solo aparece una sombra suave al bajar para separar del contenido. Un bloque espaciador (`.navbar__spacer`) reserva el alto del navbar en el flujo de la página.
- **Fila principal**: el **logo a la izquierda**, el **buscador en el centro** y el grupo de acciones (Iniciar sesión, Favoritos, Carrito) **a la derecha**.
- **Barra de accesos rápidos** (fondo azul oscuro `#081E35`, el mismo del logo) con "Más categorías", Favoritos, Ofertas, Volver a comprar y Cupones. El grupo completo queda **centrado en la franja azul** (mismo espacio a izquierda y a derecha) y con el texto en blanco. Si la ventana es muy estrecha, la franja se desplaza horizontalmente sin cortar el primer acceso.
- **"Más categorías"**: al pasar el mouse se despliega abajo una barra **horizontal** con las 7 categorías (fondo azul más claro `#123B60`) y se esconde en cuanto el mouse sale. El chevron gira 180° mientras está abierta. La zona que mantiene abierto el desplegable es fija y la barra animada nunca intercepta el ratón, así que al pasar de "Más categorías" a otro acceso el panel se cierra una sola vez (sin parpadeos) y no roba los clics de los accesos de arriba.
- **Cierre rápido**: al salir el mouse, el desplegable se oculta en ~0,23 s (90 ms de espera + 140 ms de animación), mucho más ágil que antes.
- **Espacio con las promociones**: al abrirse, el desplegable empuja el contenido hacia abajo y deja un hueco en blanco de 24 px entre la barra de categorías y la sección de promociones (nunca se superponen).

## Animaciones del navbar (GSAP)

Todo el navbar está animado con GSAP, por zonas:

- **Entrada**: al cargar, un timeline escalonado (logo → buscador → acciones → accesos rápidos → separador → botón de buscar → contador del carrito), con entrada desde arriba y un pequeño rebote (`back.out`) en los iconos y el badge.
- **Franja blanca**: el **logo** crece un 4 % al pasar el ratón, el **buscador** se levanta 2 px y gana una sombra suave, el **botón de buscar** rebota y los **iconos de sesión/favoritos/carrito** se agrandan (el contador del carrito da un golpecito).
- **Franja azul oscura**: los **iconos de los accesos rápidos** crecen al pasar el ratón, el **separador** se estira y el **chevron de "Más categorías"** crece y gira 180° (ya lo anima GSAP, no CSS).
- **Desplegable**: la barra entra desde abajo y los **7 botones de categoría** aparecen uno detrás de otro (stagger) y, al pasar el ratón, cada uno crece un poco.
- Si el sistema tiene activada la opción **"reducir movimiento"**, las animaciones de hover se desactivan.

Todos los hovers usan solo **escalas** (nunca desplazamientos): una escala nunca expulsa al puntero de su elemento, así que no se producen micro-parpadeos.

Los colores salen del propio logo: `#081E35` (azul marino), `#123B60` (azul claro) y `#45A9DB` (celeste de acento).

## Estructura

```
src/assets/logoFarmaxis.png -> tu logo (lo reemplazas cuando quieras)
src/components/Navbar.jsx   -> navbar (Fluent UI + GSAP, sin estilos inline)
src/styles/Navbar.css       -> todo el diseño del navbar
```

## Scripts

- `npm run dev` -> servidor de desarrollo
- `npm run build` -> build de producción en `dist/`
- `npm run lint` -> ESLint
- `npm run preview` -> previsualiza el build

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
