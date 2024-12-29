import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVisitorMetrics } from "@/hooks/use-visitor-metrics";
import { Globe, CreditCard, Map, Users } from "lucide-react";
import { VisitorMap } from "./VisitorMap";
import { BlogMetricsChart } from "./BlogMetricsChart";

export const AdminMetrics = () => {
  const { data: metrics, isLoading, error } = useVisitorMetrics();

  if (error) {
    console.error("Error in AdminMetrics:", error);
    return (
      <div className="p-4 text-red-500">
        Error loading metrics. Please try again later.
        {error instanceof Error && <div className="text-sm mt-2">{error.message}</div>}
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4">Loading metrics...</div>;
  }

  console.log("Rendering AdminMetrics with data:", metrics);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalVisits || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.uniqueVisitors || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalProfiles || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalDebts || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Visitor Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VisitorMap geoData={metrics?.geoData || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogMetricsChart />
        </CardContent>
      </Card>
    </div>
  );
};