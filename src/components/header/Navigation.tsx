import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-4">
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
    </nav>
  );
};