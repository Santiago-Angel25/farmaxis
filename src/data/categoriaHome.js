import {
  BriefcaseMedicalRegular,
  Cart24Regular,
  DrinkBottleRegular,
  HeartRegular,
  ShoppingBagRegular,
  SparkleRegular,
  StarRegular,
  TagPercentRegular,
} from "@fluentui/react-icons";

const categoriaHome = [
  { label: "Promociones", icon: TagPercentRegular, target: "promociones" },
  { label: "Lo más popular", icon: SparkleRegular, target: "lo-mas-popular" },
  {
    label: "Productos destacados",
    icon: StarRegular,
    target: "productos-destacados",
  },
  {
    label: "Bebidas y alimentos",
    icon: ShoppingBagRegular,
    target: "bebidas-y-alimentos",
  },
  {
    label: "Cuidado personal",
    icon: DrinkBottleRegular,
    target: "cuidado-personal",
  },
  {
    label: "Salud y medicamentos",
    icon: BriefcaseMedicalRegular,
    target: "salud-y-medicamentos",
  },
  { label: "Favoritos", icon: HeartRegular, panel: "wishlist" },
  { label: "Carrito", icon: Cart24Regular, path: "/cart" },
];

export default categoriaHome;

