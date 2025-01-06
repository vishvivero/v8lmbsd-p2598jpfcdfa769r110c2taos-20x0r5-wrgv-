import { CreditCard } from "lucide-react";
import { SidebarHeader as Header } from "@/components/ui/sidebar";

export function SidebarHeader() {
  return (
    <Header className="p-4 border-b border-border/50">
      <div className="flex items-center gap-2 px-2">
        <CreditCard className="h-6 w-6 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Debt Planner</h2>
      </div>
    </Header>
  );
}