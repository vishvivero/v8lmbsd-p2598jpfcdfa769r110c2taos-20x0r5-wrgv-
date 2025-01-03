import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import FreeTools from "./pages/FreeTools";
import Overview from "./pages/Overview";
import DebtList from "./pages/DebtList";
import ProgressTracking from "./pages/ProgressTracking";
import DebtStrategies from "./pages/DebtStrategies";
import Planner from "./pages/Planner";
import Onboarding from "./pages/Onboarding";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./components/legal/PrivacyPolicy";
import TermsOfService from "./components/legal/TermsOfService";
import DataProcessingAgreement from "./components/legal/DataProcessingAgreement";
import NewPost from "./pages/blog/NewPost";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/tools" element={<FreeTools />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/debts" element={<DebtList />} />
        <Route path="/progress" element={<ProgressTracking />} />
        <Route path="/strategies" element={<DebtStrategies />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/dpa" element={<DataProcessingAgreement />} />
        <Route path="/blog/new" element={<NewPost />} />
      </Routes>
    </Router>
  );
}

export default App;