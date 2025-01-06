import { Bell, CreditCard, Settings, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencySelector } from "./CurrencySelector";

interface DisplayPreferencesProps {
  preferredCurrency: string;
  onCurrencyChange: (currency: string) => void;
  onToggleChange: (key: string, value: boolean) => void;
  isUpdating: boolean;
}

export function DisplayPreferences({
  preferredCurrency,
  onCurrencyChange,
  onToggleChange,
  isUpdating
}: DisplayPreferencesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Display Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <CurrencySelector
            value={preferredCurrency}
            onValueChange={onCurrencyChange}
            disabled={isUpdating}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span>Show Notifications</span>
              </div>
              <Switch 
                defaultChecked 
                onCheckedChange={(checked) => onToggleChange('notifications', checked)}
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
                onCheckedChange={(checked) => onToggleChange('showPayment', checked)}
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
                onCheckedChange={(checked) => onToggleChange('showDebt', checked)}
                disabled={isUpdating}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}