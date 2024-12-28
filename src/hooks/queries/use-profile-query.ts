import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function useProfileQuery(user: User | null) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log("Checking for user profile:", user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });
}