import { useState, useEffect } from "react";
import { DebtTable } from "./DebtTable";
import { DecimalToggle } from "./DecimalToggle";
import { DeleteDebtDialog } from "./DeleteDebtDialog";
import { Debt } from "@/lib/types/debt";
import { strategies } from "@/lib/strategies";
import { calculateStandardizedPayoff } from "@/lib/utils/payment/standardizedCalculations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "./ui/button";
import { FileDown } from "lucide-react";
import { generateDebtOverviewPDF } from "@/lib/utils/pdfGenerator";
import { useToast } from "./ui/use-toast";
import { DebtTableActions } from "./DebtTableActions";

interface DebtTableContainerProps {
  debts: Debt[];
  monthlyPayment?: number;
  onUpdateDebt: (updatedDebt: Debt) => void;
  onDeleteDebt: (debtId: string) => void;
  currencySymbol?: string;
  selectedStrategy?: string;
}

export const DebtTableContainer = ({
  debts,
  monthlyPayment = 0,
  onUpdateDebt,
  onDeleteDebt,
  currencySymbol = '$',
  selectedStrategy = 'avalanche'
}: DebtTableContainerProps) => {
  const [showDecimals, setShowDecimals] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);
  const [oneTimeFundings, setOneTimeFundings] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOneTimeFundings = async () => {
    if (!user) return;
    
    console.log('Fetching one-time fundings for user:', user.id);
    const { data, error } = await supabase
      .from('one_time_funding')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_applied', false)
      .gte('payment_date', new Date().toISOString());

    if (error) {
      console.error('Error fetching one-time fundings:', error);
      return;
    }

    const mappedFundings = data.map(funding => ({
      amount: funding.amount,
      payment_date: new Date(funding.payment_date)
    }));
    
    console.log('Updated one-time fundings:', mappedFundings);
    setOneTimeFundings(mappedFundings);
  };

  useEffect(() => {
    fetchOneTimeFundings();

    const channel = supabase
      .channel('one_time_funding_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'one_time_funding',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('One-time funding change detected:', payload);
          fetchOneTimeFundings();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  console.log('DebtTableContainer: Calculating payoff with strategy:', selectedStrategy);
  const strategy = strategies.find(s => s.id === selectedStrategy) || strategies[0];
  
  const payoffDetails = calculateStandardizedPayoff(debts, monthlyPayment, strategy, oneTimeFundings);
  console.log('DebtTableContainer: Payoff details calculated:', payoffDetails);

  const handleDownloadPDF = () => {
    try {
      const allocations = new Map<string, number>();
      const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
      const remainingPayment = monthlyPayment - totalMinimumPayments;
      
      debts.forEach((debt, index) => {
        const isHighestPriority = index === 0;
        const allocation = debt.minimum_payment + (isHighestPriority ? remainingPayment : 0);
        allocations.set(debt.id, allocation);
      });

      const doc = generateDebtOverviewPDF(
        debts,
        allocations,
        payoffDetails,
        monthlyPayment,
        strategy
      );
      doc.save('debt-overview.pdf');
      
      toast({
        title: "Success",
        description: "Debt overview report downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <DebtTableActions
        showDecimals={showDecimals}
        onToggleDecimals={setShowDecimals}
        onDownloadPDF={handleDownloadPDF}
      />
      
      <div className="rounded-lg border bg-white/50 backdrop-blur-sm overflow-hidden">
        <DebtTable
          debts={debts}
          payoffDetails={payoffDetails}
          onUpdateDebt={onUpdateDebt}
          onDeleteClick={setDebtToDelete}
          showDecimals={showDecimals}
          currencySymbol={currencySymbol}
        />
      </div>

      <DeleteDebtDialog
        debt={debtToDelete}
        onClose={() => setDebtToDelete(null)}
        onConfirm={() => {
          if (debtToDelete) {
            onDeleteDebt(debtToDelete.id);
            setDebtToDelete(null);
          }
        }}
        currencySymbol={currencySymbol}
      />
    </div>
  );
};