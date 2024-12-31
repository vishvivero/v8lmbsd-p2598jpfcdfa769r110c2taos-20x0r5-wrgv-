import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";

// Lazy load routes
const Planner = lazy(() => import("./pages/Planner"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Blog = lazy(() => import("./pages/Blog"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Admin = lazy(() => import("./pages/Admin"));
const FreeTools = lazy(() => import("./pages/FreeTools"));
const PrivacyPolicy = lazy(() => import("./components/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/legal/TermsOfService"));
const DataProcessingAgreement = lazy(() => import("./components/legal/DataProcessingAgreement"));
const Onboarding = lazy(() => import("./pages/Onboarding"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/onboarding"
                element={
                  <Layout>
                    <Onboarding />
                  </Layout>
                }
              />
              <Route
                path="/planner"
                element={
                  <Layout>
                    <Planner />
                  </Layout>
                }
              />
              <Route
                path="/about"
                element={
                  <Layout>
                    <About />
                  </Layout>
                }
              />
              <Route
                path="/blog/*"
                element={
                  <Layout>
                    <Blog />
                  </Layout>
                }
              />
              <Route
                path="/faq"
                element={
                  <Layout>
                    <FAQ />
                  </Layout>
                }
              />
              <Route
                path="/pricing"
                element={
                  <Layout>
                    <Pricing />
                  </Layout>
                }
              />
              <Route
                path="/tools"
                element={
                  <Layout>
                    <FreeTools />
                  </Layout>
                }
              />
              <Route
                path="/admin/*"
                element={<Admin />}
              />
              <Route
                path="/privacy"
                element={
                  <Layout>
                    <PrivacyPolicy />
                  </Layout>
                }
              />
              <Route
                path="/terms"
                element={
                  <Layout>
                    <TermsOfService />
                  </Layout>
                }
              />
              <Route
                path="/dpa"
                element={
                  <Layout>
                    <DataProcessingAgreement />
                  </Layout>
                }
              />
            </Routes>
          </Suspense>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
