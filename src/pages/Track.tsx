import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export default function Track() {
  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Track Payments</h1>
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
        <p className="text-muted-foreground mb-8">
          Monitor and manage your payment schedule
        </p>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Payment Tracking Feature
              </h2>
              <p className="text-muted-foreground max-w-md">
                We're working hard to bring you a comprehensive payment tracking system. 
                Stay tuned for updates on this exciting new feature!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}