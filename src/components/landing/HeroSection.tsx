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

  return (
    <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 py-16">
          {/* Left side content */}
          <div className="flex-1 text-white z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                AI-Powered Debt Management
              </span>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Eliminate debt <br />
                <span className="text-primary">intelligently</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-xl">
                Take control of your financial future with our AI-powered debt elimination strategies. Smart planning for a debt-free life.
              </p>

              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to="/planner">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                      Continue to Planner <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                          Get Started Free <ArrowRight className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Start Your Journey</DialogTitle>
                        </DialogHeader>
                        <AuthForm onSuccess={handleAuthSuccess} />
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="lg">
                      Watch Demo
                    </Button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-primary">95%</h3>
                <p className="text-gray-400 mt-2">Success Rate</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-primary">3yrs</h3>
                <p className="text-gray-400 mt-2">Average Time to Freedom</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-primary">10k+</h3>
                <p className="text-gray-400 mt-2">Users Debt Free</p>
              </motion.div>
            </div>
          </div>

          {/* Right side image/animation */}
          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative z-10"
            >
              <div className="bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-lg p-6">
                <img
                  src="/placeholder.svg"
                  alt="Debt Management Dashboard"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary/10 backdrop-blur-lg rounded-lg p-4 text-white">
                  <p className="text-2xl font-bold">124k+</p>
                  <p className="text-sm text-gray-300">Active Users</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;