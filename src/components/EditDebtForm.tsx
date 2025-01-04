import { useState } from "react";
import { useDebts } from "@/hooks/use-debts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Debt } from "@/lib/types/debt";
import { CreditCard, Percent, Wallet, Coins } from "lucide-react";
import { DebtCategorySelect } from "@/components/debt/DebtCategorySelect";
import { DebtDateSelect } from "@/components/debt/DebtDateSelect";
import { useToast } from "@/components/ui/use-toast";

interface EditDebtFormProps {
  debt: Debt;
  onSubmit: (updatedDebt: Debt) => void;
}

export const EditDebtForm = ({ debt, onSubmit }: EditDebtFormProps) => {
  const { updateDebt } = useDebts();
  const { toast } = useToast();
  const [name, setName] = useState(debt.name);
  const [category, setCategory] = useState(debt.category || "Credit Card");
  const [balance, setBalance] = useState(debt.balance.toString());
  const [interestRate, setInterestRate] = useState(debt.interest_rate.toString());
  const [minimumPayment, setMinimumPayment] = useState(debt.minimum_payment.toString());
  const [bankerName, setBankerName] = useState(debt.banker_name);
  const [currencySymbol, setCurrencySymbol] = useState(debt.currency_symbol);
  const [date, setDate] = useState<Date>(new Date(debt.next_payment_date || new Date()));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const updatedDebt = {
        ...debt,
        name,
        balance: Number(balance),
        interest_rate: Number(interestRate),
        minimum_payment: Number(minimumPayment),
        banker_name: bankerName,
        currency_symbol: currencySymbol,
        category,
        next_payment_date: date.toISOString()
      };

      await updateDebt.mutateAsync(updatedDebt);
      toast({
        title: "Success",
        description: "Debt updated successfully",
      });
      onSubmit(updatedDebt);
    } catch (error) {
      console.error("Error updating debt:", error);
      toast({
        title: "Error",
        description: "Failed to update debt",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <DebtCategorySelect value={category} onChange={setCategory} />

        <div className="relative space-y-2">
          <Label className="text-sm font-medium text-gray-700">Debt Name</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-white hover:border-primary/50 transition-colors"
              placeholder="Credit Card, Personal Loan, etc."
              required
            />
          </div>
        </div>

        <div className="relative space-y-2">
          <Label className="text-sm font-medium text-gray-700">Balance</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Wallet className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="pl-10 bg-white hover:border-primary/50 transition-colors"
              placeholder="10000"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="relative space-y-2">
          <Label className="text-sm font-medium text-gray-700">Interest Rate (%)</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="pl-10 bg-white hover:border-primary/50 transition-colors"
              placeholder="5.5"
              required
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>

        <div className="relative space-y-2">
          <Label className="text-sm font-medium text-gray-700">Minimum Payment</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Coins className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="number"
              value={minimumPayment}
              onChange={(e) => setMinimumPayment(e.target.value)}
              className="pl-10 bg-white hover:border-primary/50 transition-colors"
              placeholder="250"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <DebtDateSelect 
          date={date} 
          onSelect={(newDate) => {
            console.log("Date selected in edit form:", newDate);
            newDate && setDate(newDate);
          }} 
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
      >
        Save Changes
      </Button>
    </form>
  );
};