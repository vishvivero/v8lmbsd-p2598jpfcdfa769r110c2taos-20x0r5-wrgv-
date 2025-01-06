import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AccountInfoCard() {
  const { user, refreshSession } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newName, setNewName] = useState(user?.user_metadata?.full_name || "");

  const handleUpdateName = async () => {
    try {
      setIsUpdating(true);
      console.log("Updating user name to:", newName);
      
      const { error } = await supabase.auth.updateUser({
        data: { full_name: newName }
      });

      if (error) throw error;

      await refreshSession();
      
      toast({
        title: "Success",
        description: "Your name has been updated successfully."
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating name:", error);
      toast({
        title: "Error",
        description: "Failed to update name",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Account Information
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" disabled={isUpdating}>
            Change Avatar
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 mr-4">
              <p className="text-sm text-muted-foreground">Display Name</p>
              {isEditing ? (
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={isUpdating}
                />
              ) : (
                <p className="font-medium">{user?.user_metadata?.full_name || "Not set"}</p>
              )}
            </div>
            {isEditing ? (
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleUpdateName}
                  disabled={isUpdating}
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                disabled={isUpdating}
              >
                Edit
              </Button>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" disabled={isUpdating}>
              Change
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Password</p>
              <p className="font-medium">••••••••</p>
            </div>
            <Button variant="outline" size="sm" disabled={isUpdating}>
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}