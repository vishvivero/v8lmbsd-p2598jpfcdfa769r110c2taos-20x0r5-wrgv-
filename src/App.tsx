import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "@/pages/Index";
import Overview from "@/pages/Overview";
import DebtList from "@/pages/DebtList";
import { DebtDetailsPage } from "@/components/debt/DebtDetailsPage";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import Blog from "@/pages/Blog";
import FreeTools from "@/pages/FreeTools";
import Layout from "@/components/layout/Layout";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/overview" element={<Overview />} />
                  <Route path="/overview/debts" element={<DebtList />} />
                  <Route path="/overview/debt/:debtId" element={<DebtDetailsPage />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/*" element={<Admin />} />
                  
                  {/* Public pages wrapped in Layout component */}
                  <Route path="/about" element={<Layout><About /></Layout>} />
                  <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
                  <Route path="/blog/*" element={<Layout><Blog /></Layout>} />
                  <Route path="/tools" element={<Layout><FreeTools /></Layout>} />
                </Routes>
              </div>
            </div>
            <Toaster />
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;