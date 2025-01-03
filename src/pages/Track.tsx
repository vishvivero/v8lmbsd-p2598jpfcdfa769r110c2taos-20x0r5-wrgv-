import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Info } from "lucide-react";

const Track = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const transactions = [
    {
      id: 1,
      bank: "HSBC",
      type: "Minimum",
      date: "Jan 5, 2025",
      amount: 364.32,
    },
    {
      id: 2,
      bank: "Recurring funding",
      type: "Fund",
      date: "Feb 1, 2025",
      amount: 782.88,
    },
    {
      id: 3,
      bank: "First Direct",
      type: "Minimum",
      date: "Feb 2, 2025",
      amount: 418.56,
    },
    // Add more transactions as needed
  ];

  const selectedTransaction = {
    bank: "HSBC",
    amount: 364.32,
    dueDate: "Jan 5, 2025",
    daysRemaining: 2,
    previousBalance: 17123.04,
    interestAccrued: 143.97,
    newExpenses: 0.00,
    payment: 364.32,
    newBalance: 16902.69,
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">Tracking</h1>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Tutorial
          </Badge>
        </div>
        <p className="text-muted-foreground mb-6">Record your transactions</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="w-full rounded-none">
                  <TabsTrigger 
                    value="upcoming" 
                    className="flex-1"
                    onClick={() => setActiveTab("upcoming")}
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger 
                    value="complete" 
                    className="flex-1"
                    onClick={() => setActiveTab("complete")}
                  >
                    Complete
                  </TabsTrigger>
                  <TabsTrigger 
                    value="calendar" 
                    className="flex-1"
                    onClick={() => setActiveTab("calendar")}
                  >
                    Calendar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="p-4">
                      <h3 className="font-medium mb-4">January 2025 remaining</h3>
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 hover:bg-accent rounded-lg cursor-pointer mb-2"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 bg-gray-100">
                              <span className="text-xs">{transaction.bank.charAt(0)}</span>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{transaction.bank}</span>
                                <Badge variant={transaction.type === "Fund" ? "success" : "secondary"}>
                                  {transaction.type}
                                </Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {transaction.date}
                              </span>
                            </div>
                          </div>
                          <span className="font-medium">£{transaction.amount}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="complete">
                  <div className="p-4">
                    <p className="text-muted-foreground">Completed transactions will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="calendar">
                  <div className="p-4">
                    <p className="text-muted-foreground">Calendar view coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="h-8 w-8 bg-gray-100">
                  <span className="text-xs">H</span>
                </Avatar>
                <h3 className="font-medium">HSBC</h3>
              </div>

              <div className="flex justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Planned Payment</p>
                  <p className="text-2xl font-semibold">£{selectedTransaction.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Due Date ({selectedTransaction.daysRemaining} days)
                  </p>
                  <p className="font-medium">{selectedTransaction.dueDate}</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Previous balance</span>
                  <span>£{selectedTransaction.previousBalance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest accrued</span>
                  <span>£{selectedTransaction.interestAccrued}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New expenses</span>
                  <span>£{selectedTransaction.newExpenses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment</span>
                  <span>(£{selectedTransaction.payment})</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>New balance</span>
                  <span>£{selectedTransaction.newBalance}</span>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground">Add a custom note</p>
              </div>

              <div className="space-y-4">
                <Button className="w-full">Mark complete</Button>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mt-0.5" />
                  <p>
                    Estimates only! Always review and make payments according to your creditor's
                    requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Track;