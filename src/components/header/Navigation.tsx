import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard } from "lucide-react";

export const Navigation = () => {
  const { user } = useAuth();

  return (
    <nav className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 p-4 md:p-0">
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
      >
        <Link to="/about">About</Link>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
      >
        <Link to="/pricing">Pricing</Link>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
      >
        <Link to="/blog">Blog</Link>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
      >
        <Link to="/tools">Free Tools</Link>
      </Button>
      {!user && (
        <Button 
          variant="default"
          size="sm" 
          asChild
          className="flex items-center gap-2"
        >
          <Link to="/overview">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </Button>
      )}
    </nav>
  );
};