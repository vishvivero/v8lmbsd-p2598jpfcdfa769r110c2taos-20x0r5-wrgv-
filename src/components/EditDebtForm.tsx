import { useState } from "react";
import { useDebts } from "@/hooks/use-debts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Debt } from "@/lib/types/debt";

interface EditDebtFormProps {
  debt: Debt;
  onSubmit: (updatedDebt: Debt) => void;
}

export const EditDebtForm = ({ debt, onSubmit }: EditDebtFormProps) => {
  const { updateDebt } = useDebts();
  const [name, setName] = useState(debt.name);
  const [balance, setBalance] = useState(debt.balance.toString());
  const [interestRate, setInterestRate] = useState(debt.interest_rate.toString());
  const [minimumPayment, setMinimumPayment] = useState(debt.minimum_payment.toString());
  const [bankerName, setBankerName] = useState(debt.banker_name);
  const [currencySymbol, setCurrencySymbol] = useState(debt.currency_symbol);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const updatedDebt = {
      ...debt,
      name,
      balance: Number(balance),
      interest_rate: Number(interestRate),
      minimum_payment: Number(minimumPayment),
      banker_name: bankerName,
      currency_symbol: currencySymbol,
      category: debt.category || 'Other'
    };

    await updateDebt.mutateAsync(updatedDebt);
    onSubmit(updatedDebt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label>Balance</Label>
        <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} required />
      </div>
      <div>
        <Label>Interest Rate</Label>
        <Input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} required />
      </div>
      <div>
        <Label>Minimum Payment</Label>
        <Input type="number" value={minimumPayment} onChange={(e) => setMinimumPayment(e.target.value)} required />
      </div>
      <div>
        <Label>Banker Name</Label>
        <Input value={bankerName} onChange={(e) => setBankerName(e.target.value)} required />
      </div>
      <div>
        <Label>Currency Symbol</Label>
        <Input value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
        Save Changes
      </Button>
    </form>
  );
};