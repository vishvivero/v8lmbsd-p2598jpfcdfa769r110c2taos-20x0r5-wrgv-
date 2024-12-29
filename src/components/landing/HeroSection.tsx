import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AuthForm } from "@/components/AuthForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAuthSuccess = () => {
    toast({
      title: "Welcome!",
      description: "Successfully signed in. Let's start planning your debt-free journey!",
    });
    navigate("/planner");
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/planner");
      return;
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute opacity-[0.08] bg-primary"
              style={{
                width: '40%',
                height: '40%',
                borderRadius: '40%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 30, 0],
                y: [0, 20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col py-16">
          <div className="max-w-3xl z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Beta Release
              </span>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
                Eliminate debt <br />
                <span className="text-primary">intelligently</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-xl">
                Take charge of your financial future with personalized debt repayment strategies. Plan smarter, live debt-free.
              </p>

              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to="/planner">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                      Continue to Planner <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="lg" 
                        className="bg-primary hover:bg-primary/90 gap-2"
                        onClick={handleGetStarted}
                      >
                        Get Started <ArrowRight className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Start Your Journey</DialogTitle>
                      </DialogHeader>
                      <AuthForm onSuccess={handleAuthSuccess} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;