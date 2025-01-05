import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DebtColumn } from "@/components/debt/DebtColumn";
import { Debt } from "@/lib/types";
import { DebtStatus } from "@/lib/utils/payment/types";

interface DebtColumnsListProps {
  sortedDebts: Debt[];
  payoffDetails: { [key: string]: DebtStatus };
  allocations: Map<string, number>;
}

export const DebtColumnsList = ({
  sortedDebts,
  payoffDetails,
  allocations,
}: DebtColumnsListProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex space-x-4 p-4">
        {sortedDebts.map((debt) => (
          <DebtColumn
            key={debt.id}
            debt={debt}
            payoffDetails={payoffDetails[debt.id]}
            monthlyAllocation={allocations.get(debt.id) || debt.minimum_payment}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};