import { Home, PiggyBank, Clock, ChartBar, Target, Plus } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddDebtForm } from "@/components/AddDebtForm";
import { useDebts } from "@/hooks/use-debts";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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

export function SidebarNavigation() {
  const location = useLocation();
  const { addDebt, profile } = useDebts();

  return (
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
                  >
                    <Link to={item.path} className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-primary/10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton>
                    <div className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-primary/10">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
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
                    <SidebarMenuButton asChild>
                      <Link to={subItem.path} className="flex items-center gap-3 px-4 py-2 pl-10 transition-colors hover:bg-primary/10">
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
  );
}