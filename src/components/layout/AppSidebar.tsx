import { 
  Home, 
  PiggyBank, 
  Clock, 
  ChartBar, 
  Settings,
  Moon,
  LogOut,
  CreditCard,
  User
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
  SidebarHeader
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <Sidebar className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2 px-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Debt Planner</h2>
        </div>
        {user && (
          <div className="flex items-center gap-3 mt-4 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">
                {user.user_metadata?.full_name || user.email}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="transition-colors hover:bg-primary/10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
                  >
                    <a href={item.url} className="flex items-center gap-3 px-4 py-2">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
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
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Toggle theme"
              className="px-4 py-2 hover:bg-primary/10"
            >
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
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
      </SidebarFooter>
    </Sidebar>
  );
}