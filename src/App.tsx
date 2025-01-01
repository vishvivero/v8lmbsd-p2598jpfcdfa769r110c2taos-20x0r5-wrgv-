import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Onboarding } from "./pages/onboarding/Onboarding";
import { Plan } from "./pages/onboarding/Plan"; // Import the Plan component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/plan" element={<Plan />} /> {/* Add the Plan route */}
      </Routes>
    </Router>
  );
}

export default App;
