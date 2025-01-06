import { Button } from "@/components/ui/button";

interface SocialSignInProps {
  isSignUp?: boolean;
}

export function SocialSignIn({ isSignUp = true }: SocialSignInProps) {
  return (
    <div>
      <Button 
        variant="outline" 
        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-center gap-2"
        type="button"
      >
        <img 
          src="/google.svg" 
          alt="Google" 
          className="w-5 h-5"
        />
        {isSignUp ? "Sign up with Google" : "Sign in with Google"}
      </Button>
    </div>
  );
}