import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ChartBar, Rocket } from "lucide-react";

const strategies = [
  {
    id: "minimize-interest",
    name: "Avalanche Method",
    description: "Focus on high-interest debts first to minimize overall interest payments.",
    icon: ChartBar,
  },
  {
    id: "balanced",
    name: "Balanced Approach",
    description: "Our recommended strategy that balances quick wins with long-term savings.",
    icon: Star,
    isRecommended: true,
  },
  {
    id: "reduce-loans",
    name: "Snowball Method",
    description: "Pay off smaller debts first to build momentum and motivation.",
    icon: Rocket,
  },
];

interface StrategySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const StrategySelector = ({ value, onChange }: StrategySelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {strategies.map((strategy, index) => (
        <motion.div
          key={strategy.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            className={`h-full transition-all hover:shadow-lg ${
              value === strategy.id 
                ? "border-primary ring-2 ring-primary/20" 
                : "hover:border-primary/50"
            } ${
              strategy.isRecommended 
                ? "bg-gradient-to-b from-primary/5 to-transparent" 
                : ""
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <strategy.icon className="h-8 w-8 text-primary" />
                {strategy.isRecommended && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    Our Pick
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-4">{strategy.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{strategy.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant={value === strategy.id ? "default" : "outline"}
                className="w-full"
                onClick={() => onChange(strategy.id)}
              >
                {value === strategy.id ? "Selected" : "Select Strategy"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};