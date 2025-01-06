import { CreditCard } from "lucide-react";
import { SidebarFooter } from "@/components/ui/sidebar";

export function SidebarHeader() {
  return (
    <SidebarFooter className="p-4">
      <div className="flex items-center gap-2 px-2">
        <CreditCard className="h-6 w-6 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Debt Planner</h2>
      </div>
    </SidebarFooter>
  );
}