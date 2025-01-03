import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Crown } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [showDidYouKnow, setShowDidYouKnow] = useState(true);
  const [showPaymentBalance, setShowPaymentBalance] = useState(true);
  const [showDebtBalance, setShowDebtBalance] = useState(true);
  const [showTotalDebtBalance, setShowTotalDebtBalance] = useState(true);
  const [showNotesInCards, setShowNotesInCards] = useState(true);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
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
                Change
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Nickname</p>
                  <p className="font-medium">{user?.user_metadata?.full_name || "Not set"}</p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
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
                  Change
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Currency</p>
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
                <span className="flex-1">Customize colors</span>
                <Button variant="outline" size="sm">
                  Customize
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Show 'Did you know' on homepage</span>
                  <Switch 
                    checked={showDidYouKnow}
                    onCheckedChange={setShowDidYouKnow}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Show payment funds balance</span>
                  <Switch 
                    checked={showPaymentBalance}
                    onCheckedChange={setShowPaymentBalance}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Show debt balance</span>
                  <Switch 
                    checked={showDebtBalance}
                    onCheckedChange={setShowDebtBalance}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Show total debt balance</span>
                  <Switch 
                    checked={showTotalDebtBalance}
                    onCheckedChange={setShowTotalDebtBalance}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Show notes in cards</span>
                  <Switch 
                    checked={showNotesInCards}
                    onCheckedChange={setShowNotesInCards}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h3 className="font-medium mb-1">Reset account</h3>
              <p className="text-sm text-muted-foreground mb-2">
                All user-entered data will be deleted, but your account will remain active.
              </p>
              <Button variant="outline" className="text-red-500">
                Reset
              </Button>
            </div>

            <div>
              <h3 className="font-medium mb-1">Delete account</h3>
              <p className="text-sm text-muted-foreground mb-2">
                All data will be deleted permanently.
              </p>
              <Button variant="outline" className="text-red-500">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}