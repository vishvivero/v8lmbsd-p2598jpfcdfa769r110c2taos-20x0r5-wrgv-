import { Info } from "lucide-react";

export const StrategyHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Payment Strategy
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1">
            <Info className="h-4 w-4" />
            Tutorial
          </span>
        </h1>
        <p className="text-muted-foreground mt-1">Optimize your debt payoff plan</p>
      </div>
    </div>
  );
};