import {
  BriefcaseMedicalRegular,
  CartRegular,
  DrinkBottleRegular,
  FireRegular,
  HeartRegular,
  ShowerheadRegular,
  StarRegular,
  TagPercentRegular,
} from "@fluentui/react-icons";

const categoriaHome = [
  { label: "Promociones", icon: TagPercentRegular, target: "promociones" },
  { label: "Lo más popular", icon: FireRegular, target: "lo-mas-popular" },
  {
    label: "Productos destacados",
    icon: StarRegular,
    target: "productos-destacados",
  },
  {
    label: "Bebidas y alimentos",
    icon: DrinkBottleRegular,
    target: "bebidas-y-alimentos",
  },
  {
    label: "Cuidado personal",
    icon: ShowerheadRegular,
    target: "cuidado-personal",
  },
  {
    label: "Salud y medicamentos",
    icon: BriefcaseMedicalRegular,
    target: "salud-y-medicamentos",
  },
  { label: "Favoritos", icon: HeartRegular, panel: "wishlist" },
  { label: "Carrito", icon: CartRegular, path: "/cart" },
];

export default categoriaHome;

