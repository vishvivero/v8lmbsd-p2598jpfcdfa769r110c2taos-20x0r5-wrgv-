import { supabase } from "@/integrations/supabase/client";
import { PaymentRedistribution } from "./types";

export const recordPaymentRedistribution = async ({
  fromDebtId,
  toDebtId,
  amount,
  currencySymbol
}: PaymentRedistribution) => {
  const { error } = await supabase
    .from("payment_history")
    .insert({
      total_payment: amount,
      redistributed_from: fromDebtId,
      is_redistributed: true,
      currency_symbol: currencySymbol
    });

  if (error) {
    console.error("Error recording payment redistribution:", error);
    throw error;
  }
};

export const updateDebtStatus = async (debtId: string) => {
  const { error } = await supabase
    .from("debts")
    .update({
      status: "paid",
      closed_date: new Date().toISOString()
    })
    .eq("id", debtId);

  if (error) {
    console.error("Error updating debt status:", error);
    throw error;
  }
};