import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DecimalToggle } from "./DecimalToggle";
import { DeleteDebtDialog } from "./DeleteDebtDialog";
import { Debt } from "@/lib/types/debt";
import { strategies } from "@/lib/strategies";
import { calculatePayoffDetails } from "@/lib/utils/paymentCalculations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Calendar, DollarSign, Flag, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, addMonths } from "date-fns";

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
  const [expandedDebts, setExpandedDebts] = useState<{ [key: string]: boolean }>({});
  const { user } = useAuth();
  const INITIAL_PAYMENTS_SHOWN = 3;

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
          console.log('One-time funding changed:', payload);
          fetchOneTimeFundings();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  const strategy = strategies.find(s => s.id === selectedStrategy) || strategies[0];
  const sortedDebts = strategy.calculate([...debts]);
  const payoffDetails = calculatePayoffDetails(sortedDebts, monthlyPayment, strategy, oneTimeFundings);

  const toggleExpand = (debtId: string) => {
    setExpandedDebts(prev => ({
      ...prev,
      [debtId]: !prev[debtId]
    }));
  };

  return (
    <div className="space-y-4">
      <DecimalToggle showDecimals={showDecimals} onToggle={setShowDecimals} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDebts.map((debt) => {
          const debtPayoff = payoffDetails.debts.find(d => d.id === debt.id);
          if (!debtPayoff) return null;

          const payments = Array.from({ length: debtPayoff.months }, (_, i) => {
            const date = addMonths(new Date(), i);
            return {
              date,
              amount: debt.minimum_payment,
              isEndDate: false
            };
          });

          const isExpanded = expandedDebts[debt.id];
          const displayedPayments = isExpanded 
            ? payments 
            : payments.slice(0, INITIAL_PAYMENTS_SHOWN);

          return (
            <Card key={debt.id} className="h-full">
              <CardHeader className="border-b bg-primary/5">
                <CardTitle className="text-lg font-medium flex justify-between items-center">
                  <span>{debt.name}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setDebtToDelete(debt)}
                  >
                    ×
                  </Button>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Balance: {currencySymbol}{showDecimals ? debt.balance.toFixed(2) : Math.round(debt.balance).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {displayedPayments.map((payment, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
                        index === 0 && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {index === 0 ? (
                          <DollarSign className="h-5 w-5 text-primary" />
                        ) : (
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{format(payment.date, 'MMM d, yyyy')}</p>
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            {index === 0 ? "Next Payment" : "Minimum"}
                          </Badge>
                        </div>
                      </div>
                      <span className="font-medium">
                        {currencySymbol}{showDecimals ? payment.amount.toFixed(2) : Math.round(payment.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  {/* Payoff Date */}
                  <div className="flex items-center justify-between p-4 bg-muted/10">
                    <div className="flex items-center gap-3">
                      <Flag className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">
                          {format(addMonths(new Date(), debtPayoff.months), 'MMM d, yyyy')}
                        </p>
                        <Badge variant="success" className="bg-green-600">
                          Payoff Date
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {payments.length > INITIAL_PAYMENTS_SHOWN && (
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-center gap-2 py-3"
                      onClick={() => toggleExpand(debt.id)}
                    >
                      {isExpanded ? "Show Less" : `Show ${payments.length - INITIAL_PAYMENTS_SHOWN} More`}
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "transform rotate-180"
                      )} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
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