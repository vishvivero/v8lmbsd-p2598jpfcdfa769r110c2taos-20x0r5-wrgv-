import { MainLayout } from "@/components/layout/MainLayout";
import { useDebts } from "@/hooks/use-debts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { format, addMonths } from "date-fns";
import { DebtColumn } from "@/components/debt/DebtColumn";

const Plan = () => {
  const { debts } = useDebts();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Generate upcoming payments for each debt
  const generateUpcomingPayments = (debt: any) => {
    const monthsToPayoff = Math.ceil(debt.balance / debt.minimum_payment);
    let currentDate = debt.next_payment_date ? new Date(debt.next_payment_date) : new Date();
    const payments = [];
    
    // Add monthly payments
    for (let i = 0; i < monthsToPayoff; i++) {
      payments.push({
        date: format(currentDate, 'MMM d, yyyy'),
        amount: debt.minimum_payment,
        type: i === 0 ? 'next' : 'minimum'
      });
      currentDate = addMonths(currentDate, 1);
    }

    // Add final payoff date
    const payoffDate = addMonths(
      debt.next_payment_date ? new Date(debt.next_payment_date) : new Date(), 
      monthsToPayoff
    );
    payments.push({
      date: format(payoffDate, 'MMM d, yyyy'),
      amount: 0,
      type: 'payoff'
    });

    return payments;
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
            <DebtColumn
              key={debt.id}
              name={debt.name}
              balance={debt.balance}
              payments={generateUpcomingPayments(debt)}
              currency={debt.currency_symbol}
            />
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