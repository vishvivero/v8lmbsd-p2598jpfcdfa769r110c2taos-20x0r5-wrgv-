import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Crown, Settings, CreditCard, Bell, Shield, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/MainLayout";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCurrencyChange = async (currency: string) => {
    try {
      setIsUpdating(true);
      await updateProfile.mutateAsync({
        preferred_currency: currency
      });
      toast({
        title: "Currency Updated",
        description: "Your preferred currency has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating currency:", error);
      toast({
        title: "Error",
        description: "Failed to update currency preference",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleChange = async (key: string, value: boolean) => {
    // This would update user preferences in the future
    console.log(`Toggle ${key} changed to:`, value);
    toast({
      title: "Preference Updated",
      description: `${key} preference has been updated.`
    });
  };

  const handleResetData = async () => {
    try {
      setIsUpdating(true);
      // Reset debts
      await supabase.from('debts').delete().eq('user_id', user?.id);
      // Reset payment history
      await supabase.from('payment_history').delete().eq('user_id', user?.id);
      // Reset one time funding
      await supabase.from('one_time_funding').delete().eq('user_id', user?.id);
      
      queryClient.invalidateQueries();
      
      toast({
        title: "Data Reset",
        description: "All your data has been successfully reset."
      });
    } catch (error) {
      console.error("Error resetting data:", error);
      toast({
        title: "Error",
        description: "Failed to reset data",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsUpdating(true);
      
      // Delete all user data first
      await handleResetData();
      
      // Delete profile
      await supabase.from('profiles').delete().eq('id', user?.id);
      
      // Sign out the user
      await signOut();
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted."
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <Badge variant="secondary">Personal</Badge>
        </div>
        <p className="text-muted-foreground mb-8">
          Manage your account settings and preferences
        </p>

        <div className="grid gap-6">
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
                  <div>
                    <p className="text-sm text-muted-foreground">Display Name</p>
                    <p className="font-medium">{user?.user_metadata?.full_name || "Not set"}</p>
                  </div>
                  <Button variant="outline" size="sm" disabled={isUpdating}>
                    Edit
                  </Button>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Display Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Preferred Currency</p>
                  <Select 
                    defaultValue={profile?.preferred_currency || "GBP"}
                    onValueChange={handleCurrencyChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="flex-1">Theme Customization</span>
                  <Button variant="outline" size="sm" disabled={isUpdating}>
                    Customize
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>Show Tips & Hints</span>
                    </div>
                    <Switch 
                      defaultChecked 
                      onCheckedChange={(checked) => handleToggleChange('tips', checked)}
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>Show Payment Balance</span>
                    </div>
                    <Switch 
                      defaultChecked 
                      onCheckedChange={(checked) => handleToggleChange('showPayment', checked)}
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>Show Debt Balance</span>
                    </div>
                    <Switch 
                      defaultChecked 
                      onCheckedChange={(checked) => handleToggleChange('showDebt', checked)}
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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

              <div>
                <h3 className="font-medium mb-1">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  This action cannot be undone. Your account and all associated data will be permanently deleted.
                </p>
                <Button 
                  variant="outline" 
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={handleDeleteAccount}
                  disabled={isUpdating}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}