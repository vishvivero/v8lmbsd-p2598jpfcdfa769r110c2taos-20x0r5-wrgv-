import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Crown, Settings, CreditCard, Bell, Shield, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Profile() {
  const { user } = useAuth();

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
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Display Name</p>
                    <p className="font-medium">{user?.user_metadata?.full_name || "Not set"}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Password</p>
                    <p className="font-medium">••••••••</p>
                  </div>
                  <Button variant="outline" size="sm">
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
                  <Select defaultValue="GBP">
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
                  <Button variant="outline" size="sm">
                    Customize
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>Show Tips & Hints</span>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>Show Payment Balance</span>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>Show Debt Balance</span>
                    </div>
                    <Switch defaultChecked />
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
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                  Reset Data
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-1">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  This action cannot be undone. Your account and all associated data will be permanently deleted.
                </p>
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
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