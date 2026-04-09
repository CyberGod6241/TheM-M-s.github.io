import LandingPage from "./Dashboard/LandingPage";
import Customer from "./Dashboard/Customer";
import { Routes, Route } from "react-router-dom";

const C = {
  brown900: "#1E0A00",
  brown800: "#3B1400",
  brown700: "#5C2200",
  brown600: "#7B3410",
  orange: "#F97316",
  orangeD: "#EA580C",
  orangeL: "#FED7AA",
  cream: "#FFF8F2",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage Color={C} />} />
      <Route path="/customer" element={<Customer Color={C} />} />
    </Routes>
  );
}

export default App;
