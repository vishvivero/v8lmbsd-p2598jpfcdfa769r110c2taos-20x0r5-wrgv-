import { CreditCard, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { SidebarHeader as Header } from "@/components/ui/sidebar";

export function SidebarHeader() {
  const { user } = useAuth();

  return (
    <Header className="p-4 border-b border-border/50">
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
    </Header>
  );
}