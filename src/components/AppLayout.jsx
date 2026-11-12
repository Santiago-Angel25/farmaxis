import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
import Chatbot from "./Chatbot";

function AppLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <CartDrawer />
      <WishlistDrawer />
      <Chatbot />
      <Footer />
    </>
  );
}

export default AppLayout;
