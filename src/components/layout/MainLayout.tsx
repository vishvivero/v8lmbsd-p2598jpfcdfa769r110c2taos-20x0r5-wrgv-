import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "@/components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="pt-16">
            <SidebarTrigger className="fixed top-4 left-4 z-50" />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}