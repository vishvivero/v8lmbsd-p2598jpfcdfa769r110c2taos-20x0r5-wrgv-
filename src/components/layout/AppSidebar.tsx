import { 
  Home, 
  PiggyBank, 
  Clock, 
  ChartBar, 
  Settings,
  Moon,
  LogOut,
  CreditCard,
  User,
  Plus,
  Target
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddDebtForm } from "@/components/AddDebtForm";
import { useDebts } from "@/hooks/use-debts";

interface MenuItem {
  title: string;
  path?: string;
  icon: React.ComponentType;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  icon: React.ComponentType;
  isDialog?: boolean;
  path?: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Overview",
    path: "/planner",
    icon: Home,
  },
  {
    title: "Debts",
    path: "/planner/debts",
    icon: PiggyBank,
    subItems: [
      {
        title: "Add New Debt",
        icon: Plus,
        isDialog: true
      }
    ]
  },
  {
    title: "Strategy",
    path: "/planner/strategy",
    icon: Target,
  },
  {
    title: "Payment History",
    path: "/planner/history",
    icon: Clock,
  },
  {
    title: "Reports",
    path: "/planner/reports",
    icon: ChartBar,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { addDebt, profile } = useDebts();

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
                <div key={item.title}>
                  <SidebarMenuItem>
                    {item.path ? (
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.path}
                        className="transition-colors hover:bg-primary/10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
                      >
                        <Link to={item.path} className="flex items-center gap-3 px-4 py-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        className="transition-colors hover:bg-primary/10"
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                  {item.subItems?.map((subItem) => (
                    <SidebarMenuItem key={subItem.title}>
                      {subItem.isDialog ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start pl-10 py-2 hover:bg-primary/10"
                            >
                              <subItem.icon className="h-4 w-4 mr-3" />
                              {subItem.title}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Debt</DialogTitle>
                            </DialogHeader>
                            <AddDebtForm
                              onAddDebt={addDebt.mutateAsync}
                              currencySymbol={profile?.preferred_currency || "£"}
                            />
                          </DialogContent>
                        </Dialog>
                      ) : subItem.path ? (
                        <SidebarMenuButton
                          asChild
                          className="pl-10 transition-colors hover:bg-primary/10"
                        >
                          <Link to={subItem.path} className="flex items-center gap-3 px-4 py-2">
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      ) : null}
                    </SidebarMenuItem>
                  ))}
                </div>
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