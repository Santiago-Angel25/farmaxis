import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";

function AppLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <CartDrawer />
      <WishlistDrawer />
      <Footer />
    </>
  );
}

export default AppLayout;