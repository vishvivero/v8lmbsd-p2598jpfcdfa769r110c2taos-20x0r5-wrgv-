import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as AuthUser } from "@supabase/supabase-js";

interface SidebarUserProfileProps {
  user: AuthUser | null;
}

export function SidebarUserProfile({ user }: SidebarUserProfileProps) {
  if (!user) return null;
  
  return (
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
  );
}