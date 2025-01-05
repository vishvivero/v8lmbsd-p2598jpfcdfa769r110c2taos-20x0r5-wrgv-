import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { PaymentCard } from "./PaymentCard";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Payment {
  date: string;
  amount: number;
  type: 'next' | 'minimum' | 'payoff';
}

interface DebtColumnProps {
  name: string;
  balance: number;
  payments: Payment[];
  currency: string;
}

export const DebtColumn = ({ name, balance, payments, currency }: DebtColumnProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_PAYMENTS_SHOWN = 3;
  
  const displayedPayments = isExpanded 
    ? payments.filter(p => p.type !== 'payoff')
    : payments.filter(p => p.type !== 'payoff').slice(0, INITIAL_PAYMENTS_SHOWN);
  
  const payoffPayment = payments.find(p => p.type === 'payoff');

  return (
    <Card className="min-w-[300px] snap-start flex-shrink-0 bg-white/95">
      <CardHeader className="border-b bg-primary/5">
        <h3 className="text-lg font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">
          Balance: {currency}{balance.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayedPayments.map((payment, index) => (
            <PaymentCard
              key={index}
              date={payment.date}
              amount={payment.amount}
              type={payment.type}
              currency={currency}
            />
          ))}

          {payoffPayment && (
            <PaymentCard
              date={payoffPayment.date}
              amount={payoffPayment.amount}
              type="payoff"
              currency={currency}
            />
          )}

          {payments.length > INITIAL_PAYMENTS_SHOWN && (
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 py-3"
              onClick={() => setIsExpanded(!isExpanded)}
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
};