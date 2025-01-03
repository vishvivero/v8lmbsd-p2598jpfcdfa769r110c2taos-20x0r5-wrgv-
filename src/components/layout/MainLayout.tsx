import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "@/components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function MainLayout({ children, sidebar }: MainLayoutProps) {
  const SidebarComponent = sidebar || <AppSidebar />;
  const hasSidebar = !!sidebar || true;
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        {SidebarComponent}
        <div className={`flex-1 flex flex-col relative ${!hasSidebar ? 'max-w-full' : ''}`}>
          <Header />
          <main className="flex-1 pt-16">
            <SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}