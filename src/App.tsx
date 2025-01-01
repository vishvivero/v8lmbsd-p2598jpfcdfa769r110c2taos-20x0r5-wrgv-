import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Index"; // Changed from ./pages/Home to ./pages/Index
import Onboarding from "./pages/Onboarding"; // Changed path and removed curly braces
import { Plan } from "./pages/onboarding/Plan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/plan" element={<Plan />} />
      </Routes>
    </Router>
  );
}

export default App;