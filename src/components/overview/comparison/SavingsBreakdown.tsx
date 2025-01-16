import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Smartphone, Palmtree } from "lucide-react";

interface SavingsBreakdownProps {
  totalSavings: number;
}

export const SavingsBreakdown = ({ totalSavings }: SavingsBreakdownProps) => {
  return (
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle className="text-lg">What You Could Do With Your Savings</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 text-gray-600">
            <Plane className="w-5 h-5" />
            <span>{Math.floor(totalSavings / 1000)} international trips</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Smartphone className="w-5 h-5" />
            <span>{Math.floor(totalSavings / 800)} premium smartphones</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Palmtree className="w-5 h-5" />
            <span>a dream family vacation</span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};