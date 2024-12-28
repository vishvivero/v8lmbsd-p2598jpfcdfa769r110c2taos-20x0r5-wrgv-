import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Debt } from "@/lib/strategies";
import { motion } from "framer-motion";

interface AddDebtFormProps {
  onAddDebt: (debt: Omit<Debt, "id">) => void;
}

export const AddDebtForm = ({ onAddDebt }: AddDebtFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    interestRate: "",
    minimumPayment: "",
    bankerName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDebt({
      name: formData.name,
      balance: Number(formData.balance),
      interestRate: Number(formData.interestRate),
      minimumPayment: Number(formData.minimumPayment),
      bankerName: formData.bankerName,
    });
    setFormData({
      name: "",
      balance: "",
      interestRate: "",
      minimumPayment: "",
      bankerName: "",
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="debt-form"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Add Debt
        </Button>
      </div>
    </motion.form>
  );
};