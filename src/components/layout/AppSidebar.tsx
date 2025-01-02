import { CreditCard } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooterMenu } from "./sidebar/SidebarFooterMenu";

export function AppSidebar() {
  const { user, signOut } = useAuth();

  return (
    <Sidebar className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Debt Planner</h2>
        </div>
        <SidebarUserProfile user={user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarFooterMenu onSignOut={signOut} />
      </SidebarFooter>
    </Sidebar>
  );
}