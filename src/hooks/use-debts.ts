import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PaymentHistory } from "@/lib/types/debt";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { useProfileQuery } from "./queries/use-profile-query";
import { useDebtsQuery } from "./queries/use-debts-query";
import { useDebtMutations } from "./mutations/use-debt-mutations";

export function useDebts() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: profile } = useProfileQuery(user);
  const { data: debts, isLoading } = useDebtsQuery(!!profile);
  const { addDebt, updateDebt, deleteDebt } = useDebtMutations();

  const createProfile = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("No user ID available");
      
      console.log("Creating profile for user:", user.id);
      const { data, error } = await supabase
        .from("profiles")
        .insert([{ id: user.id, email: user.email }])
        .select()
        .maybeSingle();

      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }

      return data;
    },
    onError: (error: Error) => {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try signing out and signing back in.",
        variant: "destructive",
      });
    }
  });

  const recordPayment = useMutation({
    mutationFn: async (payment: Omit<PaymentHistory, "id">) => {
      const { data, error } = await supabase
        .from("payment_history")
        .insert([payment])
        .select()
        .single();

      if (error) {
        console.error("Error recording payment:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    },
  });

  return {
    debts,
    isLoading,
    addDebt,
    updateDebt,
    deleteDebt,
    recordPayment,
    profile,
  };
}