import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Debt, PaymentHistory } from "@/lib/types/debt";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { useProfile } from "./use-profile";

export function useDebts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();

  const { data: debts, isLoading } = useQuery({
    queryKey: ["debts", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("No user ID available for debts fetch");
        return [];
      }
      
      console.log("Fetching debts for user:", user.id);
      const { data, error } = await supabase
        .from("debts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching debts:", error);
        toast({
          title: "Error",
          description: "Failed to fetch debts",
          variant: "destructive",
        });
        return [];
      }

      console.log("Debts fetched:", data);
      return data as Debt[];
    },
    enabled: !!user?.id,
  });

  const deleteDebt = useMutation({
    mutationFn: async (debtId: string) => {
      console.log("Deleting debt:", debtId);
      const { error } = await supabase
        .from("debts")
        .delete()
        .eq("id", debtId);

      if (error) {
        console.error("Error deleting debt:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      toast({
        title: "Success",
        description: "Debt deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error in deleteDebt mutation:", error);
      toast({
        title: "Error",
        description: "Failed to delete debt",
        variant: "destructive",
      });
    },
  });

  const addDebt = useMutation({
    mutationFn: async (newDebt: Omit<Debt, "id">) => {
      if (!user?.id) throw new Error("No user ID available");

      console.log("Adding new debt:", newDebt);
      const { data, error } = await supabase
        .from("debts")
        .insert([{ ...newDebt, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error("Error adding debt:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      toast({
        title: "Success",
        description: "Debt added successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error in addDebt mutation:", error);
      toast({
        title: "Error",
        description: "Failed to add debt. Please try signing out and signing back in.",
        variant: "destructive",
      });
    },
  });

  const updateDebt = useMutation({
    mutationFn: async (updatedDebt: Debt) => {
      const { data, error } = await supabase
        .from("debts")
        .update({
          name: updatedDebt.name,
          banker_name: updatedDebt.banker_name,
          balance: updatedDebt.balance,
          interest_rate: updatedDebt.interest_rate,
          minimum_payment: updatedDebt.minimum_payment,
          currency_symbol: updatedDebt.currency_symbol,
        })
        .eq("id", updatedDebt.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating debt:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      toast({
        title: "Success",
        description: "Debt updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update debt",
        variant: "destructive",
      });
    },
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
    updateProfile,
  };
}