import Navbar from "../LandingPage/pages/NavBar";
import Bokeh from "../LandingPage/pages/Bokeh";
import Hero from "../LandingPage/pages/Hero";
import Banner from "../LandingPage/pages/Banner";
import MenuSection from "../LandingPage/pages/MenuSection";
import OrderCTA from "../LandingPage/pages/OrderCTA";
import Footer from "../LandingPage/pages/Footer";

import { menuData as FALLBACK_MENU } from "../LandingPage/constants/data";
import { C } from "../LandingPage/constants/theme";
import { useEffect, useState } from "react";
import { getMenuItems } from "../utils/api";

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function LandingPage() {
  const [menuData, setMenuData] = useState(FALLBACK_MENU);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const response = await getMenuItems();
        // Handle both array and object response formats
        const items = Array.isArray(response)
          ? response
          : response.menu || response.data || [];
        if (items.length > 0) {
          // Group items by category
          const grouped = items.reduce((acc, item) => {
            const category = item.category || "Other";
            if (!acc.find((g) => g.category === category)) {
              acc.push({
                category,
                items: [],
              });
            }
            const group = acc.find((g) => g.category === category);
            group.items.push(item.name || item.title);
            return acc;
          }, []);
          setMenuData(grouped);
        }
      } catch (error) {
        console.error("Failed to load menu data:", error);
        // Fallback to hardcoded menu
        setMenuData(FALLBACK_MENU);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

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
      {!loading && <MenuSection C={C} menuData={menuData} />}
      <OrderCTA C={C} />
      <Footer C={C} />
    </div>
  );
}

export default LandingPage;
