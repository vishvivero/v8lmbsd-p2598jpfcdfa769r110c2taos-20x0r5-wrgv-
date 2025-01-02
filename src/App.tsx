import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Planner from "./pages/Planner";
import DebtList from "./pages/DebtList";
import { AppSidebar } from "./components/layout/AppSidebar";

function App() {
  return (
    <Router>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/planner/debts" element={<DebtList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
