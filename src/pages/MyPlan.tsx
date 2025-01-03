import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function MyPlan() {
  const [planType, setPlanType] = useState("personal");

  const plans = {
    plus: {
      name: "Plus",
      price: "$20",
      interval: "USD/month",
      description: "Level up productivity and creativity with expanded access",
      features: [
        "Everything in Free",
        "Extended limits on messaging, file uploads, advanced data analysis, and image generation",
        "Access to advanced voice and video inputs",
        "Limited access to o1 and o1-mini",
        "Opportunities to test new features",
        "Create and use projects and custom GPTs",
        "Limited access to Sora video generation"
      ]
    },
    pro: {
      name: "Pro",
      price: "$200",
      interval: "USD/month",
      description: "Get the best of OpenAI with the highest level of access",
      features: [
        "Everything in Plus",
        "Unlimited access to o1, o1-mini, GPT-4o, and advanced voice (audio only)",
        "Higher limits for video and screensharing in advanced voice",
        "Access to o1 pro mode, which uses more compute for the best answers to the hardest questions",
        "Extended access to Sora video generation"
      ]
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-8">Upgrade your plan</h1>
          <ToggleGroup 
            type="single" 
            value={planType}
            onValueChange={(value) => value && setPlanType(value)}
            className="inline-flex bg-muted p-1 rounded-lg"
          >
            <ToggleGroupItem 
              value="personal" 
              className="px-4 py-2 rounded-md data-[state=on]:bg-background data-[state=on]:shadow"
            >
              Personal
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="business"
              className="px-4 py-2 rounded-md data-[state=on]:bg-background data-[state=on]:shadow"
            >
              Business
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(plans).map(([key, plan]) => (
            <Card key={key} className="p-8 relative overflow-hidden">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.interval}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <Button 
                className="w-full mb-8" 
                variant={key === "pro" ? "default" : "secondary"}
              >
                {key === "plus" ? "Your current plan" : `Get ${plan.name}`}
              </Button>

              <ul className="space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-2">
                <button className="text-sm text-muted-foreground hover:underline block">
                  Manage my subscription
                </button>
                <button className="text-sm text-muted-foreground hover:underline block">
                  I need help with a billing issue
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-lg">Need more capabilities for your business?</span>
          </div>
          <Button variant="link" className="text-primary hover:text-primary/80">
            See Enterprise Plans
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}