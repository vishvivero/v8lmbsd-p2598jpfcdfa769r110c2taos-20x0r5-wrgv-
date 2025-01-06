import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { SidebarNavigation } from "@/components/sidebar/SidebarNavigation";
import { SidebarFooter } from "@/components/sidebar/SidebarFooter";
import { SidebarRail } from "@/components/ui/sidebar";
import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  
  return (
    <Sidebar 
      className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative"
      collapsible="icon"
    >
      <SidebarRail className="group">
        {state === "expanded" ? (
          <ArrowLeftToLine className="h-4 w-4 absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
        ) : (
          <ArrowRightToLine className="h-4 w-4 absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </SidebarRail>
      <SidebarHeader />
      <SidebarNavigation />
      <SidebarFooter />
    </Sidebar>
  );
}