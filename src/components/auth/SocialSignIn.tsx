import { Button } from "@/components/ui/button";

export function SocialSignIn() {
  return (
    <div className="grid grid-cols-2 gap-4">
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
        Sign up with Google
      </Button>
      <Button 
        variant="outline"
        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-center gap-2"
        type="button"
      >
        <img 
          src="/apple.svg" 
          alt="Apple" 
          className="w-5 h-5"
        />
        Sign up with Apple
      </Button>
    </div>
  );
}