import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  PiggyBank, 
  Clock, 
  ChartBar, 
  Settings,
  Moon,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Overview",
    url: "/planner",
    icon: Home,
  },
  {
    title: "Debts",
    url: "/planner/debts",
    icon: PiggyBank,
  },
  {
    title: "Payment History",
    url: "/planner/history",
    icon: Clock,
  },
  {
    title: "Reports",
    url: "/planner/reports",
    icon: ChartBar,
  },
];

export function SidebarNavigation() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === item.url}
              tooltip={item.title}
            >
              <Link 
                to={item.url} 
                className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-primary/10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            tooltip="Settings"
          >
            <div className="flex items-center gap-3 px-4 py-2 hover:bg-primary/10">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            tooltip="Toggle theme"
          >
            <div className="flex items-center gap-3 px-4 py-2 hover:bg-primary/10">
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            onClick={signOut}
            tooltip="Sign out"
          >
            <div className="flex items-center gap-3 px-4 py-2 hover:bg-destructive/10 text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}