import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Debt, PaymentHistory } from "@/lib/types/debt";
import { useToast } from "@/components/ui/use-toast";

export function useDebtMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addDebt = useMutation({
    mutationFn: async (newDebt: Omit<Debt, "id">) => {
      console.log("Adding new debt:", newDebt);
      const { data, error } = await supabase
        .from("debts")
        .insert([newDebt])
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update debt",
        variant: "destructive",
      });
    },
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

  return {
    addDebt,
    updateDebt,
    deleteDebt,
  };
}