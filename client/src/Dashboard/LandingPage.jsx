import Navbar from "../LandingPage/pages/NavBar";
import Bokeh from "../LandingPage/pages/Bokeh";
import Hero from "../LandingPage/pages/Hero";
import Banner from "../LandingPage/pages/Banner";
import MenuSection from "../LandingPage/pages/MenuSection";
import OrderCTA from "../LandingPage/pages/OrderCTA";
import Footer from "../LandingPage/pages/Footer";

import { menuData } from "../LandingPage/constants/data";
import { C } from "../LandingPage/constants/theme";

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: C?.brown900 || "#3f1e0e",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <Navbar C={C} />
      <Bokeh C={C} />
      <Hero C={C} />
      <Banner C={C} />
      <MenuSection C={C} menuData={menuData} />
      <OrderCTA C={C} />
      <Footer C={C} />
    </div>
  );
}

export default LandingPage;
