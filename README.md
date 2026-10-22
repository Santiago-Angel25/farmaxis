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

- **Barra de accesos rápidos** (fondo azul oscuro `#081E35`, el mismo del logo) con "Más categorías", Favoritos, Ofertas, Volver a comprar y Cupones. Todos centrados y con el texto en blanco.
- **"Más categorías"**: al pasar el mouse se despliega abajo una barra **horizontal** con las 7 categorías (fondo azul más claro `#123B60`) y se esconde en cuanto el mouse sale. El chevron gira 180° mientras está abierta.
- **Al hacer scroll** el navbar se va **desvaneciendo** progresivamente (hasta desaparecer a los ~240 px) y vuelve a mostrarse completo al subir. Cuando ya es invisible deja de interceptar los clics del contenido.

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
