import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddDebtFormProps {
  onAddDebt: (debt: Omit<Debt, "id">) => void;
  currencySymbol: string;
}

const DEBT_CATEGORIES = [
  "Credit Card",
  "Personal Loan",
  "Mortgage",
  "Student Loan",
  "Auto Loan",
  "Medical Debt",
  "Other"
] as const;

export const AddDebtForm = ({ onAddDebt, currencySymbol }: AddDebtFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    interest_rate: "",
    minimum_payment: "",
    banker_name: "Not specified",
    next_payment_date: "",
    category: "Other" as typeof DEBT_CATEGORIES[number],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    onAddDebt({
      name: formData.name,
      balance: Number(formData.balance),
      interest_rate: Number(formData.interest_rate),
      minimum_payment: Number(formData.minimum_payment),
      banker_name: formData.banker_name,
      currency_symbol: currencySymbol,
      user_id: user.id,
      next_payment_date: new Date(formData.next_payment_date),
      category: formData.category,
    });
    
    setFormData({
      name: "",
      balance: "",
      interest_rate: "",
      minimum_payment: "",
      banker_name: "Not specified",
      next_payment_date: "",
      category: "Other",
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="debt-form"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium whitespace-nowrap">Debt Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Credit Card"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium whitespace-nowrap">Balance ({currencySymbol})</label>
          <Input
            type="number"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            placeholder="10000"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium whitespace-nowrap">Interest Rate (%)</label>
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
          <label className="text-sm font-medium whitespace-nowrap">Minimum Payment ({currencySymbol})</label>
          <Input
            type="number"
            value={formData.minimum_payment}
            onChange={(e) => setFormData({ ...formData, minimum_payment: e.target.value })}
            placeholder="200"
            required
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Next Payment Due Date</label>
          <Input
            type="date"
            value={formData.next_payment_date}
            onChange={(e) => setFormData({ ...formData, next_payment_date: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as typeof DEBT_CATEGORIES[number] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {DEBT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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