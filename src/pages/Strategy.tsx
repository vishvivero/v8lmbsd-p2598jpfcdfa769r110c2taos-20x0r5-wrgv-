import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebts } from "@/hooks/use-debts";
import { formatCurrency } from "@/lib/strategies";
import { ArrowRight, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ExtraPaymentDialog } from "@/components/strategy/ExtraPaymentDialog";
import { Button } from "@/components/ui/button";

export default function Strategy() {
  const { debts, profile } = useDebts();
  const [extraPayment, setExtraPayment] = useState("0");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;

  const handleSaveExtra = (amount: number) => {
    setExtraPayment(amount.toString());
  };

  return (
    <MainLayout>
      <div className="container py-8 space-y-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Strategy</h1>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1">
            <Info className="h-4 w-4" />
            Tutorial
          </div>
        </div>
        <p className="text-muted-foreground">Optimize your payoff plan</p>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-blue-500">↻</span> Recurring funding
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Amount to use for making payments each cycle
            </p>

            <div className="space-y-4">
              <div>
                <Label>FREQUENCY</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Once per month on the 1st</SelectItem>
                    <SelectItem value="biweekly">Every two weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>AMOUNT</Label>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Minimum</span>
                    <span className="font-medium">
                      {formatCurrency(totalMinimumPayments, profile?.preferred_currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Extra</span>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <span>{profile?.preferred_currency}</span>
                      <Input
                        type="number"
                        value={extraPayment}
                        readOnly
                        className="w-24 text-right"
                      />
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">
                      {formatCurrency(totalMinimumPayments + Number(extraPayment), profile?.preferred_currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-blue-500">□</span> One-time fundings
            </h2>
            <p className="text-sm text-muted-foreground">
              Bonus amounts for making payments
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              0 upcoming
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-blue-500">⚖</span> Extra payment priority
            </h2>
            <p className="text-sm text-muted-foreground">
              Which debts get extra payments first
            </p>
            <Select defaultValue="avalanche">
              <SelectTrigger className="w-full mt-4">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avalanche">Debt Avalanche</SelectItem>
                <SelectItem value="snowball">Debt Snowball</SelectItem>
                <SelectItem value="balance">Balance Ratio</SelectItem>
              </SelectContent>
            </Select>
          </Card>
        </div>

        <ExtraPaymentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          currentPayment={totalMinimumPayments}
          onSave={handleSaveExtra}
          currencySymbol={profile?.preferred_currency || "£"}
        />
      </div>
    </MainLayout>
  );
}