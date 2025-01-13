import { Card } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, CreditCard } from "lucide-react";
import { useState } from "react";

interface DebtListProps {
  debts: Debt[];
}

export const DebtList = ({ debts }: DebtListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {debts.length} {debts.length === 1 ? 'Debt' : 'Debts'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click to view all debts
              </p>
            </div>
          </div>
          <CollapsibleTrigger>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-4 space-y-2">
          {debts.map((debt, index) => (
            <div
              key={debt.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {debt.name}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {debt.currency_symbol}{debt.balance.toLocaleString()}
              </span>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};