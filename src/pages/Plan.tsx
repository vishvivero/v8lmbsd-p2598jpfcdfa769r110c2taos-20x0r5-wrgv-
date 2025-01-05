import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useDebts } from "@/hooks/use-debts";
import { addMonths, format } from "date-fns";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const Plan = () => {
  const { debts, profile } = useDebts();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  console.log("Fetched debts:", debts);

  // Generate upcoming payments for each debt
  const generateUpcomingPayments = () => {
    if (!debts) return {};
    
    const paymentsByDebt: { [key: string]: Array<{date: string; amount: number; currency: string}> } = {};
    
    debts.forEach(debt => {
      const monthsToPayoff = Math.ceil(debt.balance / debt.minimum_payment);
      let currentDate = debt.next_payment_date ? new Date(debt.next_payment_date) : new Date();
      paymentsByDebt[debt.id] = [];
      
      for (let i = 0; i < monthsToPayoff; i++) {
        paymentsByDebt[debt.id].push({
          date: format(currentDate, 'MMM d, yyyy'),
          amount: debt.minimum_payment,
          currency: debt.currency_symbol
        });
        currentDate = addMonths(currentDate, 1);
      }
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
          {debts?.map((debt) => (
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
                  <div className="divide-y max-h-[500px] overflow-y-auto">
                    {paymentsByDebt[debt.id]?.map((payment, index) => (
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
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
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