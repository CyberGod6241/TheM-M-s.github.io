import Navbar from "../LandingPage/Navbar";
import Bokeh from "../LandingPage/Bokeh";
import Hero from "../LandingPage/Hero";
import Banner from "../LandingPage/Banner";
import MenuSection from "../LandingPage/MenuSection";
import OrderCTA from "../LandingPage/OrderCTA";
import Footer from "../LandingPage/Footer";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const menuData = [
  {
    category: "Food",
    items: [
      "Kumchop Jollof Rice",
      "Fried Rice",
      "Asun Jollof",
      "Yagi Rice",
      "Opada Rice",
      "Pounded Yam with Soup",
      "Semo with Soup",
      "Moi Moi",
      "Moi Moi with Egg",
      "Dodo",
      "White Rice",
      "Stir Spag",
    ],
  },
  {
    category: "🥩 Protein",
    items: [
      "Beef",
      "Hake Fish",
      "Croaker Fish",
      "Titus Fish",
      "Egg",
      "Bush Meat",
      "Turkey Chicken",
      "Tilapia Fish",
    ],
  },
  {
    category: "🥪 Snacks",
    items: ["Chicken Pie", "Meat Pie", "Doughnut"],
  },
  {
    category: "🍦 Ice Cream",
    items: ["Parfait", "Fan Ice-Cream"],
  },
  {
    category: "🥗 Fruits & Veg",
    items: ["Fruit Salad", "Coleslaw", "Plastic", "Takeaway"],
  },
];

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function LandingPage({ Color: C }) {
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
