import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Onboarding } from "./pages/onboarding/Onboarding";
import { Plan } from "./pages/onboarding/Plan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/plan" element={<Plan />} />
      </Routes>
    </Router>
  );
}

export default App;