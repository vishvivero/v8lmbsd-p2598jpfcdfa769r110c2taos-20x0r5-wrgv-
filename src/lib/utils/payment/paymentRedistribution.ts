import { supabase } from "@/integrations/supabase/client";
import { PaymentRedistribution } from "./types";

export const recordPaymentRedistribution = async ({
  fromDebtId,
  toDebtId,
  amount,
  userId,
  currencySymbol
}: PaymentRedistribution) => {
  console.log('Recording payment redistribution:', {
    fromDebtId,
    toDebtId,
    amount,
    userId,
    currencySymbol
  });

  const { error } = await supabase
    .from('payment_history')
    .insert({
      user_id: userId,
      total_payment: amount,
      redistributed_from: fromDebtId,
      is_redistributed: true,
      currency_symbol: currencySymbol
    });

  if (error) {
    console.error('Error recording payment redistribution:', error);
    throw error;
  }
};

export const updateDebtStatus = async (debtId: string) => {
  console.log('Updating debt status for:', debtId);
  
  const { error } = await supabase
    .from('debts')
    .update({ status: 'closed', closed_date: new Date().toISOString() })
    .eq('id', debtId);

  if (error) {
    console.error('Error updating debt status:', error);
    throw error;
  }
};