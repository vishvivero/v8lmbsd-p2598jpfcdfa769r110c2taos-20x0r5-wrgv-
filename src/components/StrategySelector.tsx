import { Strategy } from "@/lib/strategies";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Wallet, ArrowUpDown } from "lucide-react";

interface StrategySelectorProps {
  strategies: Strategy[];
  selectedStrategy: Strategy;
  onSelectStrategy: (strategy: Strategy) => void;
}

export const StrategySelector = ({
  strategies,
  selectedStrategy,
  onSelectStrategy,
}: StrategySelectorProps) => {
  const getStrategyIcon = (id: string) => {
    switch (id) {
      case "avalanche":
        return <ArrowUpDown className="h-5 w-5 text-primary" />;
      case "snowball":
        return <Target className="h-5 w-5 text-primary" />;
      default:
        return <Wallet className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {strategies.map((strategy, index) => (
        <motion.div
          key={strategy.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          <Card
            className={`p-6 h-full cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedStrategy.id === strategy.id
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => onSelectStrategy(strategy)}
          >
            {index === 1 && (
              <Badge
                className="absolute -top-2 right-4 bg-primary text-white"
                variant="default"
              >
                Our Pick
              </Badge>
            )}
            
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                {getStrategyIcon(strategy.id)}
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold">{strategy.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {strategy.description}
                </p>
                
                <Button
                  variant={selectedStrategy.id === strategy.id ? "default" : "outline"}
                  className="mt-4 w-full"
                  onClick={() => onSelectStrategy(strategy)}
                >
                  {selectedStrategy.id === strategy.id ? (
                    "Selected"
                  ) : (
                    <>
                      Select Strategy
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};