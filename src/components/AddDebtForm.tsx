import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebts } from "@/hooks/use-debts";
import { CreditCard, Percent, Wallet, Coins } from "lucide-react";
import { DebtCategorySelect } from "@/components/debt/DebtCategorySelect";
import { DebtDateSelect } from "@/components/debt/DebtDateSelect";

export interface AddDebtFormProps {
  onAddDebt?: (debt: any) => void;
  currencySymbol?: string;
}

export const AddDebtForm = ({ onAddDebt, currencySymbol = "£" }: AddDebtFormProps) => {
  const { addDebt } = useDebts();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Credit Card");
  const [balance, setBalance] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newDebt = {
      name,
      balance: Number(balance),
      interest_rate: Number(interestRate),
      minimum_payment: Number(minimumPayment),
      banker_name: "Not specified", // Setting a default value since we removed the field
      currency_symbol: currencySymbol, // Using the prop value
      next_payment_date: date.toISOString(),
      category
    };

    if (onAddDebt) {
      onAddDebt(newDebt);
    } else {
      await addDebt.mutateAsync(newDebt);
    }

    // Reset form fields
    setName("");
    setCategory("Credit Card");
    setBalance("");
    setInterestRate("");
    setMinimumPayment("");
    setDate(new Date());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <DebtCategorySelect value={category} onChange={setCategory} />

        <div className="relative">
          <Label className="text-sm font-medium text-gray-700">Debt Name</Label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-white"
              placeholder="Credit Card, Personal Loan, etc."
              required
            />
          </div>
        </div>

        <div className="relative">
          <Label className="text-sm font-medium text-gray-700">Balance</Label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Wallet className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="pl-10 bg-white"
              placeholder="10000"
              required
            />
          </div>
        </div>

        <div className="relative">
          <Label className="text-sm font-medium text-gray-700">Interest Rate (%)</Label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="pl-10 bg-white"
              placeholder="5.5"
              required
            />
          </div>
        </div>

        <div className="relative">
          <Label className="text-sm font-medium text-gray-700">Minimum Payment</Label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Coins className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="number"
              value={minimumPayment}
              onChange={(e) => setMinimumPayment(e.target.value)}
              className="pl-10 bg-white"
              placeholder="250"
              required
            />
          </div>
        </div>

        <DebtDateSelect date={date} onSelect={(date) => date && setDate(date)} />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-white"
      >
        Add Debt
      </Button>
    </form>
  );
};

export default AddDebtForm;