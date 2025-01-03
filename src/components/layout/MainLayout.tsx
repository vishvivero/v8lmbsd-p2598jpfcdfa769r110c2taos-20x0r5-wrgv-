import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "@/components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function MainLayout({ children, sidebar }: MainLayoutProps) {
  const SidebarComponent = sidebar || <AppSidebar />;
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {SidebarComponent}
        <div className="flex-1">
          <Header />
          <main className="pt-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
            <SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden" />
            <div className="w-full max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}