import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const StrategyFeatureDescription = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Your Path to Financial Freedom
        </h1>
        <p className="text-muted-foreground">
          Take control of your debt journey with our intelligent payment strategy optimizer
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/95 backdrop-blur-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Smart Payment Planning</h3>
              <p className="text-sm text-muted-foreground">
                Optimize your debt payoff with intelligent payment allocation and real-time impact visualization
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/95 backdrop-blur-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingDown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Interest Savings</h3>
              <p className="text-sm text-muted-foreground">
                Watch your interest savings grow as you make strategic extra payments and one-time contributions
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/95 backdrop-blur-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Achievement Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Celebrate your progress with payment streaks, milestones, and visual progress tracking
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          className="group bg-primary hover:bg-primary/90"
          size="lg"
        >
          Start Optimizing
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};