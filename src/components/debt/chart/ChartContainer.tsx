import { motion } from "framer-motion";
import { ChartArea } from "./ChartArea";
import { ChartTooltip } from "./ChartTooltip";
import { useState } from "react";
import { ChartData } from "./types";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";
import { generateBaselineChartData } from "./chartUtils";

interface ChartContainerProps {
  data: ChartData[];
  maxDebt: number;
  currencySymbol: string;
  oneTimeFundings: OneTimeFunding[];
}

export const ChartContainer = ({
  data,
  maxDebt,
  currencySymbol,
  oneTimeFundings
}: ChartContainerProps) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    date: string;
    values: { name: string; value: number }[];
  } | null>(null);

  // Generate baseline data (without extra payments and redistributions)
  const baselineData = generateBaselineChartData(data);

  // Extract unique debt names from the data
  const debtNames = Object.keys(data[0]).filter(key => 
    key !== 'date' && key !== 'Total' && key !== 'monthLabel' && key !== 'month'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-[400px] w-full"
    >
      <ChartArea
        data={data}
        maxDebt={maxDebt}
        currencySymbol={currencySymbol}
        onHover={setTooltipData}
        oneTimeFundings={oneTimeFundings}
        baselineData={baselineData}
        debtNames={debtNames}
      />
      {tooltipData && (
        <ChartTooltip
          x={tooltipData.x}
          y={tooltipData.y}
          date={tooltipData.date}
          values={tooltipData.values}
          currencySymbol={currencySymbol}
        />
      )}
    </motion.div>
  );
};