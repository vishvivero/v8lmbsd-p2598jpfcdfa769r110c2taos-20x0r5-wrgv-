import { Debt } from "@/lib/types/debt";
import { Strategy, strategies, formatCurrency } from "@/lib/strategies";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AmortizationTable } from "./AmortizationTable";

interface DebtDetailsProps {
  debt: Debt;
  payoffDetails: any; // TODO: Add proper type from standardizedCalculations
  onMonthlyPaymentChange: (payment: number) => void;
  onStrategyChange: (strategyId: string) => void;
}

export const DebtDetails = ({ 
  debt, 
  payoffDetails, 
  onMonthlyPaymentChange, 
  onStrategyChange 
}: DebtDetailsProps) => {
  console.log('Rendering DebtDetails with:', { debt, payoffDetails });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Debt Information</h2>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <p className="text-lg">{debt.name}</p>
            </div>
            <div>
              <Label>Balance</Label>
              <p className="text-lg">{formatCurrency(debt.balance, debt.currency_symbol)}</p>
            </div>
            <div>
              <Label>Interest Rate</Label>
              <p className="text-lg">{debt.interest_rate}%</p>
            </div>
            <div>
              <Label>Minimum Payment</Label>
              <p className="text-lg">{formatCurrency(debt.minimum_payment, debt.currency_symbol)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Payment Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="monthlyPayment">Monthly Payment</Label>
              <Input
                id="monthlyPayment"
                type="number"
                min={debt.minimum_payment}
                value={payoffDetails?.monthlyPayment || debt.minimum_payment}
                onChange={(e) => onMonthlyPaymentChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="strategy">Repayment Strategy</Label>
              <Select 
                onValueChange={onStrategyChange}
                defaultValue="avalanche"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map((strategy: Strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Amortization Schedule</h2>
        <AmortizationTable 
          debt={debt}
          payoffDetails={payoffDetails}
        />
      </Card>
    </div>
  );
};