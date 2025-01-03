import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MainLayout } from "@/components/layout/MainLayout";

const Help = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground">Find answers to common questions and learn how to use our features.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Learn the basics of using our debt management tools</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I add a new debt?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Overview page and click the "Add Debt" button. Fill in the required information about your debt, including the balance, interest rate, and minimum payment.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I track my payments?</AccordionTrigger>
                  <AccordionContent>
                    Use the Track page to view your payment history and upcoming payments. You can also mark payments as complete and view your progress over time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What payment strategies are available?</AccordionTrigger>
                  <AccordionContent>
                    We offer several debt payment strategies including Avalanche (highest interest first) and Snowball (lowest balance first). Visit the Strategy page to learn more and choose the best approach for you.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account & Settings</CardTitle>
              <CardDescription>Manage your account preferences and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I update my profile?</AccordionTrigger>
                  <AccordionContent>
                    Click on Settings in the sidebar, then select "Profile" to update your personal information and preferences.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I change my payment settings?</AccordionTrigger>
                  <AccordionContent>
                    Visit the Settings menu and select "My Plan" to view and modify your payment preferences and subscription details.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I get support?</AccordionTrigger>
                  <AccordionContent>
                    For additional support, you can contact our team through the support form below or email us at support@example.com.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Help;