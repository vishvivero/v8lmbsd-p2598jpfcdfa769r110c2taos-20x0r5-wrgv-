import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { SidebarNavigation } from "@/components/sidebar/SidebarNavigation";
import { SidebarFooter } from "@/components/sidebar/SidebarFooter";

export function AppSidebar() {
  return (
    <Sidebar 
      className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      collapsible="icon"
    >
      <SidebarHeader />
      <SidebarNavigation />
      <SidebarFooter />
    </Sidebar>
  );
}