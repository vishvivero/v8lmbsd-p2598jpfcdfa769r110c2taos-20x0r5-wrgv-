import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Debt } from "@/lib/types/debt";

export function useDebtsQuery(profileExists: boolean) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["debts"],
    queryFn: async () => {
      console.log("Fetching debts");
      const { data, error } = await supabase
        .from("debts")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching debts:", error);
        toast({
          title: "Error",
          description: "Failed to fetch debts",
          variant: "destructive",
        });
        throw error;
      }

      return data as Debt[];
    },
    enabled: profileExists,
  });
}