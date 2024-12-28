import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Debt, PaymentHistory } from "@/lib/types/debt";
import { useToast } from "@/components/ui/use-toast";

export function useDebts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: debts, isLoading } = useQuery({
    queryKey: ["debts"],
    queryFn: async () => {
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
  });

  const addDebt = useMutation({
    mutationFn: async (newDebt: Omit<Debt, "id">) => {
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
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add debt",
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
    recordPayment,
  };
}