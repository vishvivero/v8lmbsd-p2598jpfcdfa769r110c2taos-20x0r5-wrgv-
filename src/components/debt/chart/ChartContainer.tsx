import { motion } from "framer-motion";
import { ChartArea } from "./ChartArea";
import { ChartTooltip } from "./ChartTooltip";
import { useState } from "react";
import { ChartData } from "./types";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";

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
      />
      {tooltipData && (
        <div 
          style={{ 
            position: 'absolute',
            left: tooltipData.x + 10,
            top: tooltipData.y - 10,
            pointerEvents: 'none',
            zIndex: 100
          }}
        >
          <ChartTooltip
            active={true}
            currencySymbol={currencySymbol}
            date={tooltipData.date}
            values={tooltipData.values}
          />
        </div>
      )}
    </motion.div>
  );
};