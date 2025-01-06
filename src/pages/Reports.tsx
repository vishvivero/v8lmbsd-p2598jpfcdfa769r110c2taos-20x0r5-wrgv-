import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Calculator } from "lucide-react";
import { useDebts } from "@/hooks/use-debts";
import { MainLayout } from "@/components/layout/MainLayout";
import { OverviewTab } from "@/components/reports/OverviewTab";
import { AmortizationTab } from "@/components/reports/AmortizationTab";

export default function Reports() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { debts } = useDebts();

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Financial Reports</h1>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="amortization" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Amortization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab debts={debts || []} />
          </TabsContent>

          <TabsContent value="amortization">
            <AmortizationTab debts={debts || []} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}