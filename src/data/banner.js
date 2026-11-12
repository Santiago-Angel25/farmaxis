import bannerPrimeraCompra from "../assets/banner-primera-compra.png";
import bannerElectrolit from "../assets/banner-electrolit.png";
import bannerPediasure from "../assets/banner-pediasure.png";
import bannerProteina from "../assets/banner-proteina.png";
const Banner = [
  {
    id: "promocion-1",
    image: bannerPrimeraCompra,
    alt: "Primera compra en Farmaxis con 20% de descuento",
    target: "/categories",
    fit: "cover",
  },
  {
    id: "promocion-2",
    image: bannerElectrolit,
    alt: "Electrolit: hidratación instantánea",
    target: "/categories?category=groceries&subcategory=bebidas",
    fit: "contain promo-carousel__slide--electrolit",
  },
  {
    id: "promocion-4",
    image: bannerPediasure,
    alt: "PediaSure: nutrición para el crecimiento",
    target: "/categories?category=suplementos",
    fit: "contain promo-carousel__slide--pediasure",
  },
  {
    id: "promocion-5",
    image: bannerProteina,
    alt: "Proteína Whey Optimum Nutrition",
    target: "/categories?category=suplementos",
    fit: "contain promo-carousel__slide--proteina",
  },
];

export default Banner;
