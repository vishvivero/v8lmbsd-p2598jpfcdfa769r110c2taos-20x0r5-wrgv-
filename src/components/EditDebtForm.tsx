import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Debt } from "@/lib/strategies";
import { DialogClose } from "@/components/ui/dialog";

interface EditDebtFormProps {
  debt: Debt;
  onSubmit: (updatedDebt: Debt) => void;
}

export const EditDebtForm = ({ debt, onSubmit }: EditDebtFormProps) => {
  const [formData, setFormData] = useState({
    name: debt.name,
    balance: debt.balance.toString(),
    interestRate: debt.interestRate.toString(),
    minimumPayment: debt.minimumPayment.toString(),
    bankerName: debt.bankerName,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: debt.id,
      name: formData.name,
      balance: Number(formData.balance),
      interestRate: Number(formData.interestRate),
      minimumPayment: Number(formData.minimumPayment),
      bankerName: formData.bankerName,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Banking Institution</label>
        <Input
          value={formData.bankerName}
          onChange={(e) => setFormData({ ...formData, bankerName: e.target.value })}
          placeholder="Bank of America"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Debt Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Credit Card"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Balance</label>
        <Input
          type="number"
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
          placeholder="10000"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Interest Rate (%)</label>
        <Input
          type="number"
          value={formData.interestRate}
          onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
          placeholder="15.99"
          step="0.01"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Minimum Payment</label>
        <Input
          type="number"
          value={formData.minimumPayment}
          onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
          placeholder="200"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit">Save Changes</Button>
        </DialogClose>
      </div>
    </form>
  );
};