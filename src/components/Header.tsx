import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { LogIn, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { AuthForm } from "@/components/AuthForm";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out",
        description: "Successfully signed out of your account.",
      });
      navigate("/");
    }
  };

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
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Debtfreeo</span>
            </Link>
            
            {isLandingPage && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/about" 
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  About
                </Link>
                <Link 
                  to="/pricing" 
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
                <Link 
                  to="/blog" 
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </nav>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/planner">
                <Button variant="outline" size="sm">
                  Go to Planner
                </Button>
              </Link>
              {profile?.is_admin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl p-8">
                  <DialogHeader>
                    {/* Removed "Welcome to Debt Strategist" text */}
                  </DialogHeader>
                  <div className="mt-8">
                    <AuthForm onSuccess={handleAuthSuccess} />
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl p-8">
                  <DialogHeader>
                    {/* Removed "Welcome to Debt Strategist" text */}
                  </DialogHeader>
                  <div className="mt-8">
                    <AuthForm onSuccess={handleAuthSuccess} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;