import { useState } from "react";
import { useDebts } from "@/hooks/use-debts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EditDebtFormProps {
  isOpen: boolean;
  onClose: () => void;
  debt: {
    id: string;
    name: string;
    balance: number;
    interest_rate: number;
    minimum_payment: number;
    banker_name: string;
    currency_symbol: string;
    user_id?: string;
  };
}

export const EditDebtForm = ({ isOpen, onClose, debt }: EditDebtFormProps) => {
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
      id,
      name,
      balance: Number(balance),
      interest_rate: Number(interestRate),
      minimum_payment: Number(minimumPayment),
      banker_name: bankerName,
      currency_symbol: currencySymbol,
      user_id: debt.user_id,
      category: 'Other' // Add required category field
    };

    await updateDebt.mutateAsync(updatedDebt);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Debt</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};
