import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DangerZoneCardProps {
  showNotifications: boolean;
}

export const DangerZoneCard = ({ showNotifications }: DangerZoneCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleResetData = async () => {
    try {
      setIsUpdating(true);
      await supabase.from('debts').delete().eq('user_id', user?.id);
      await supabase.from('payment_history').delete().eq('user_id', user?.id);
      await supabase.from('one_time_funding').delete().eq('user_id', user?.id);
      
      queryClient.invalidateQueries();
      
      if (showNotifications) {
        toast({
          title: "Data Reset",
          description: "All your data has been successfully reset."
        });
      }
    } catch (error) {
      console.error("Error resetting data:", error);
      if (showNotifications) {
        toast({
          title: "Error",
          description: "Failed to reset data",
          variant: "destructive"
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-1">Reset Account Data</h3>
          <p className="text-sm text-muted-foreground mb-2">
            All user-entered data will be deleted, but your account will remain active.
          </p>
          <Button 
            variant="outline" 
            className="text-destructive border-destructive hover:bg-destructive/10"
            onClick={handleResetData}
            disabled={isUpdating}
          >
            Reset Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};