import { motion } from "framer-motion";
import { ChartArea } from "./ChartArea";
import { ChartData } from "./types";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";

interface ChartContainerProps {
  data: ChartData[];
  maxDebt: number;
  currencySymbol: string;
  oneTimeFundings: OneTimeFunding[];
}

export const ChartContainer = ({ data, maxDebt, currencySymbol, oneTimeFundings }: ChartContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[400px] p-6 rounded-2xl bg-white"
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700">Balance</h3>
      </div>
      <ChartArea 
        data={data} 
        maxDebt={maxDebt}
        currencySymbol={currencySymbol}
        oneTimeFundings={oneTimeFundings}
      />
    </motion.div>
  );
};