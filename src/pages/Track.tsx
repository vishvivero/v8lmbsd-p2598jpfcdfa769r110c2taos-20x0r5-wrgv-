import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, CheckCircle2, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Track() {
  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Track Payments</h1>
          <Badge variant="secondary">Overview</Badge>
        </div>
        <p className="text-muted-foreground mb-8">
          Monitor and manage your payment schedule
        </p>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="complete" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Complete
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Upcoming Payments</span>
                  <Button>Add Payment</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Payment #{item}</p>
                          <p className="text-sm text-muted-foreground">Due in 3 days</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">£150.00</span>
                        <Button variant="outline" size="sm">
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complete">
            <Card>
              <CardHeader>
                <CardTitle>Completed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Payment #{item}</p>
                          <p className="text-sm text-muted-foreground">Paid on 1st March 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">£150.00</span>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Payment Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Calendar view coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}