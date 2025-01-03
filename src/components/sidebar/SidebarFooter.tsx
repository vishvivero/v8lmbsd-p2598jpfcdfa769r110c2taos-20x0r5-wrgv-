import { Settings, Moon, LogOut, Sun, UserCircle, CreditCard } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarFooter as Footer,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

export function SidebarFooter() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Footer>
      <SidebarSeparator className="opacity-50" />
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            tooltip="Settings"
            className="px-4 py-2 hover:bg-primary/10"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </SidebarMenuButton>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={location.pathname === "/profile"}
              >
                <Link to="/profile" className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={location.pathname === "/my-plan"}
              >
                <Link to="/my-plan" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>My Plan</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            onClick={toggleTheme}
            tooltip="Toggle theme"
            className="px-4 py-2 hover:bg-primary/10"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span>Theme</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            onClick={signOut} 
            tooltip="Sign out"
            className="px-4 py-2 hover:bg-destructive/10 text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </Footer>
  );
}