import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import type { Debt } from "@/lib/types";

export function useDebtMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const updateDebt = useMutation({
    mutationFn: async (updatedDebt: Debt) => {
      if (!user?.id) throw new Error("No user ID available");

      console.log("Updating debt:", updatedDebt);
      const { data, error } = await supabase
        .from("debts")
        .update(updatedDebt)
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
      queryClient.invalidateQueries({ queryKey: ["debts", user?.id] });
      toast({
        title: "Debt updated",
        description: "Your debt has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error("Error in updateDebt mutation:", error);
      toast({
        title: "Error updating debt",
        description: "There was an error updating your debt. Please try again.",
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
      queryClient.invalidateQueries({ queryKey: ["debts", user?.id] });
      toast({
        title: "Debt added",
        description: "Your new debt has been successfully added.",
      });
    },
    onError: (error) => {
      console.error("Error in addDebt mutation:", error);
      toast({
        title: "Error adding debt",
        description: "There was an error adding your debt. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteDebt = useMutation({
    mutationFn: async (debtId: string) => {
      if (!user?.id) throw new Error("No user ID available");

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
      queryClient.invalidateQueries({ queryKey: ["debts", user?.id] });
      toast({
        title: "Debt deleted",
        description: "Your debt has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error("Error in deleteDebt mutation:", error);
      toast({
        title: "Error deleting debt",
        description: "There was an error deleting your debt. Please try again.",
        variant: "destructive",
      });
    },
  });

  return { updateDebt, addDebt, deleteDebt };
}