import { Calendar, DollarSign, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PaymentCardProps {
  date: string;
  amount: number;
  type: 'next' | 'minimum' | 'payoff';
  currency: string;
}

export const PaymentCard = ({ date, amount, type, currency }: PaymentCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'next':
        return <DollarSign className="h-5 w-5 text-primary" />;
      case 'payoff':
        return <Flag className="h-5 w-5 text-green-600" />;
      default:
        return <Calendar className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getBadge = () => {
    switch (type) {
      case 'next':
        return <Badge className="bg-primary">Next Payment</Badge>;
      case 'payoff':
        return <Badge variant="secondary" className="bg-green-600 text-white">Payoff Date</Badge>;
      default:
        return <Badge variant="secondary">Minimum</Badge>;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b">
      <div className="flex items-center gap-3">
        {getIcon()}
        <div>
          <p className="font-medium">{date}</p>
          {getBadge()}
        </div>
      </div>
      <span className="font-medium">
        {currency}{amount.toLocaleString()}
      </span>
    </div>
  );
};