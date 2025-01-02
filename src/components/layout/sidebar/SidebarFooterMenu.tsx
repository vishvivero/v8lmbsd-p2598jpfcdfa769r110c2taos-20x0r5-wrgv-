import { Settings, Moon, LogOut } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SidebarFooterMenuProps {
  onSignOut: () => void;
}

export function SidebarFooterMenu({ onSignOut }: SidebarFooterMenuProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          className="px-4 py-2 hover:bg-primary/10"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          className="px-4 py-2 hover:bg-primary/10"
        >
          <Moon className="h-4 w-4" />
          <span>Dark Mode</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={onSignOut}
          className="px-4 py-2 hover:bg-destructive/10 text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}