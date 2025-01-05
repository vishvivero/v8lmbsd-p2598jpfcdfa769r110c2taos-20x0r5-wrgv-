import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, DollarSign, ChevronLeft, ChevronRight, ChevronDown, Flag } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useDebts } from "@/hooks/use-debts";
import { addMonths, format } from "date-fns";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Plan = () => {
  const { debts, profile } = useDebts();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedDebts, setExpandedDebts] = useState<{ [key: string]: boolean }>({});
  
  console.log("Fetched debts:", debts);

  // Generate upcoming payments for each debt
  const generateUpcomingPayments = () => {
    if (!debts) return {};
    
    const paymentsByDebt: { [key: string]: Array<{date: string; amount: number; currency: string; isEndDate?: boolean}> } = {};
    
    debts.forEach(debt => {
      const monthsToPayoff = Math.ceil(debt.balance / debt.minimum_payment);
      let currentDate = debt.next_payment_date ? new Date(debt.next_payment_date) : new Date();
      paymentsByDebt[debt.id] = [];
      
      // Add monthly payments
      for (let i = 0; i < monthsToPayoff; i++) {
        paymentsByDebt[debt.id].push({
          date: format(currentDate, 'MMM d, yyyy'),
          amount: debt.minimum_payment,
          currency: debt.currency_symbol,
          isEndDate: false
        });
        currentDate = addMonths(currentDate, 1);
      }

      // Add final payoff date
      const payoffDate = addMonths(
        debt.next_payment_date ? new Date(debt.next_payment_date) : new Date(), 
        monthsToPayoff
      );
      paymentsByDebt[debt.id].push({
        date: format(payoffDate, 'MMM d, yyyy'),
        amount: 0,
        currency: debt.currency_symbol,
        isEndDate: true
      });
    });

    return paymentsByDebt;
  };

  const paymentsByDebt = generateUpcomingPayments();

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 300;
    const container = scrollContainerRef.current;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleExpand = (debtId: string) => {
    setExpandedDebts(prev => ({
      ...prev,
      [debtId]: !prev[debtId]
    }));
  };

  const INITIAL_PAYMENTS_SHOWN = 3;

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Upcoming Payments by Debt</h1>
            <p className="text-muted-foreground mt-2">
              Track your future payments for each debt
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {debts?.map((debt) => {
            const payments = paymentsByDebt[debt.id] || [];
            const isExpanded = expandedDebts[debt.id];
            const regularPayments = payments.filter(p => !p.isEndDate);
            const endDatePayment = payments.find(p => p.isEndDate);
            
            const displayedPayments = isExpanded 
              ? regularPayments 
              : regularPayments.slice(0, INITIAL_PAYMENTS_SHOWN);
            
            return (
              <div
                key={debt.id}
                className="min-w-[300px] snap-start flex-shrink-0"
              >
                <Card className="h-full">
                  <CardHeader className="border-b bg-primary/5">
                    <CardTitle className="text-lg font-medium">
                      {debt.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Balance: {debt.currency_symbol}{debt.balance.toLocaleString()}
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
                              <p className="font-medium">{payment.date}</p>
                              <Badge variant={index === 0 ? "default" : "secondary"}>
                                {index === 0 ? "Next Payment" : "Minimum"}
                              </Badge>
                            </div>
                          </div>
                          <span className="font-medium">
                            {payment.currency}{payment.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}

                      {/* Always show end date */}
                      {endDatePayment && (
                        <div className="flex items-center justify-between p-4 bg-muted/10">
                          <div className="flex items-center gap-3">
                            <Flag className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">{endDatePayment.date}</p>
                              <Badge variant="success" className="bg-green-600">
                                Payoff Date
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}

                      {regularPayments.length > INITIAL_PAYMENTS_SHOWN && (
                        <Button
                          variant="ghost"
                          className="w-full flex items-center justify-center gap-2 py-3"
                          onClick={() => toggleExpand(debt.id)}
                        >
                          {isExpanded ? "Show Less" : `Show ${regularPayments.length - INITIAL_PAYMENTS_SHOWN} More`}
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded && "transform rotate-180"
                          )} />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
      </div>
    </MainLayout>
  );
};

export default Plan;