import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function MainLayout({ children, sidebar }: MainLayoutProps) {
  const SidebarComponent = sidebar || <AppSidebar />;
  const hasSidebar = !!sidebar || true;
  const location = useLocation();
  const [defaultOpen, setDefaultOpen] = useState(true);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDefaultOpen(window.innerWidth >= 1024); // 1024px is the lg breakpoint
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen w-full">
        {SidebarComponent}
        <div className={`flex-1 flex flex-col relative ${!hasSidebar ? 'max-w-full' : ''}`}>
          <Header />
          <main className="flex-1 pt-16">
            <div className="content-container">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}