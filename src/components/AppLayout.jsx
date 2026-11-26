import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
import Chatbot from "./Chatbot";

function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-layout__content">
        <Outlet />
      </main>
      <CartDrawer />
      <WishlistDrawer />
      <Chatbot />
      <Footer />
    </div>
  );
}

export default AppLayout;
