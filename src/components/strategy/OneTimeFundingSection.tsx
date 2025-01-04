import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { OneTimeFundingDialog } from "./OneTimeFundingDialog";
import { useState } from "react";

export const OneTimeFundingSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-primary" />
          One-time Funding
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Bonus amounts for making payments
        </p>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Add One-time Funding
        </Button>
      </CardContent>
      <OneTimeFundingDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </Card>
  );
};