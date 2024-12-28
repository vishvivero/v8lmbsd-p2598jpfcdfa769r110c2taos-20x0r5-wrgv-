import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Debt } from "@/lib/types/debt";
import { DialogClose } from "@/components/ui/dialog";

interface EditDebtFormProps {
  debt: Debt;
  onSubmit: (updatedDebt: Debt) => void;
}

export const EditDebtForm = ({ debt, onSubmit }: EditDebtFormProps) => {
  const [formData, setFormData] = useState({
    name: debt.name,
    balance: debt.balance.toString(),
    interest_rate: debt.interest_rate.toString(),
    minimum_payment: debt.minimum_payment.toString(),
    banker_name: debt.banker_name,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: debt.id,
      name: formData.name,
      balance: Number(formData.balance),
      interest_rate: Number(formData.interest_rate),
      minimum_payment: Number(formData.minimum_payment),
      banker_name: formData.banker_name,
      currency_symbol: debt.currency_symbol,
      user_id: debt.user_id,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Banking Institution</label>
        <Input
          value={formData.banker_name}
          onChange={(e) => setFormData({ ...formData, banker_name: e.target.value })}
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
          value={formData.interest_rate}
          onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
          placeholder="15.99"
          step="0.01"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Minimum Payment</label>
        <Input
          type="number"
          value={formData.minimum_payment}
          onChange={(e) => setFormData({ ...formData, minimum_payment: e.target.value })}
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