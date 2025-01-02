import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "@/pages/Index";
import Planner from "@/pages/Planner";
import DebtList from "@/pages/DebtList";

// Create a client
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
                  <Route path="/planner" element={<Planner />} />
                  <Route path="/planner/debts" element={<DebtList />} />
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