import {
  Search24Regular,
  Person24Regular,
  Heart24Regular,
  Cart24Regular,
  TicketDiagonal24Regular,
  Tag24Regular,
  History24Regular,
  ChevronDown16Regular,
} from "@fluentui/react-icons";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-main">
        <a className="brand" href="/" aria-label="Farmaxis droguerías, inicio">
          <span className="brand-name"><span>f</span>armaxis</span>
          <span className="brand-subtitle">droguerías</span>
        </a>

        <form className="search-container" role="search" onSubmit={(event) => event.preventDefault()}>
          <input aria-label="Buscar productos" type="search" placeholder="Buscar medicamentos, cuidado personal, higiene..." />
          <button className="search-button" type="submit" aria-label="Buscar"><Search24Regular /></button>
        </form>

        
        <button className="login-button" type="button"><Person24Regular /><span>Iniciar sesión</span></button>
        <button className="navbar-icon" type="button" aria-label="Favoritos"><Heart24Regular /></button>
        <button className="navbar-icon cart-button" type="button" aria-label="Carrito, 2 productos"><Cart24Regular /><span className="cart-counter">2</span></button>
      </div>

      <nav className="navbar-options" aria-label="Accesos rápidos">
        <button type="button"><ChevronDown16Regular />Más categorías</button>
        <button type="button">Favoritos<Heart24Regular /></button>
        <button type="button">Ofertas<Tag24Regular /></button>
        <button type="button">Volver a comprar<History24Regular /></button>
        <button type="button">Cupones<TicketDiagonal24Regular /></button>
      </nav>

      <nav className="navbar-categories" aria-label="Categorías de productos">
        <button type="button">Salud y medicamentos</button>
        <button type="button">Belleza</button>
        <button type="button">Cuidado del bebé</button>
        <button type="button">Cuidado personal</button>
        <button type="button">Dermocosmética</button>
        <button type="button">Alimentos y bebidas</button>
        <button type="button">Hogar, mascotas y otros</button>
      </nav>
    </header>
  );
}

export default Navbar;



