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
        <div className="flex-1 flex flex-col w-full">
          <Header />
          <main className="flex-1 pt-16 w-full">
            <SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden" />
            <div className="container">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}