import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebts } from "@/hooks/use-debts";

const AddDebtForm = () => {
  const { addDebt } = useDebts();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");
  const [bankerName, setBankerName] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("£");
  const [nextPaymentDate, setNextPaymentDate] = useState(new Date());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newDebt = {
      name,
      balance: Number(balance),
      interest_rate: Number(interestRate),
      minimum_payment: Number(minimumPayment),
      banker_name: bankerName,
      currency_symbol: currencySymbol,
      next_payment_date: nextPaymentDate.toISOString(), // Convert Date to ISO string
      category: 'Other' // Add required category field
    };

    await addDebt.mutateAsync(newDebt);
    // Reset form fields
    setName("");
    setBalance("");
    setInterestRate("");
    setMinimumPayment("");
    setBankerName("");
    setNextPaymentDate(new Date());
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
        <Label>Interest Rate (%)</Label>
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
      <div>
        <Label>Next Payment Date</Label>
        <Input type="date" value={nextPaymentDate.toISOString().split("T")[0]} onChange={(e) => setNextPaymentDate(new Date(e.target.value))} required />
      </div>
      <Button type="submit">Add Debt</Button>
    </form>
  );
};

export default AddDebtForm;
