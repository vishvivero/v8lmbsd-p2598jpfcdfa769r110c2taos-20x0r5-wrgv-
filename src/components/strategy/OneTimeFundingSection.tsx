import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { OneTimeFundingDialog } from "./OneTimeFundingDialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface FundingEntry {
  id: string;
  amount: number;
  payment_date: string;
  notes: string | null;
  currency_symbol: string;
}

export const OneTimeFundingSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fundingEntries, setFundingEntries] = useState<FundingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFundingEntries = async () => {
    console.log('Fetching one-time funding entries');
    try {
      const { data, error } = await supabase
        .from('one_time_funding')
        .select('*')
        .order('payment_date', { ascending: true })
        .eq('is_applied', false);

      if (error) throw error;
      
      setFundingEntries(data || []);
      console.log('Fetched funding entries:', data);
    } catch (error) {
      console.error('Error fetching funding entries:', error);
      toast({
        title: "Error",
        description: "Failed to load funding entries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFundingEntries();
  }, []);

  const handleDelete = async (id: string) => {
    console.log('Deleting funding entry:', id);
    try {
      const { error } = await supabase
        .from('one_time_funding')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFundingEntries(entries => entries.filter(entry => entry.id !== id));
      toast({
        title: "Success",
        description: "Funding entry deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting funding entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete funding entry",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-primary" />
          One-time Funding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Add extra payments to accelerate your debt payoff
        </p>
        
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading...</div>
        ) : fundingEntries.length > 0 ? (
          <div className="space-y-3">
            {fundingEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {entry.currency_symbol}{entry.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(entry.payment_date), "PPP")}
                  </p>
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {entry.notes}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(entry.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            No upcoming funding entries
          </p>
        )}

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Add One-time Funding
        </Button>
      </CardContent>
      <OneTimeFundingDialog 
        isOpen={isDialogOpen} 
        onClose={() => {
          setIsDialogOpen(false);
          fetchFundingEntries();
        }} 
      />
    </Card>
  );
};