import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useVisitorMetrics } from "@/hooks/use-visitor-metrics";
import { Users, Globe, CreditCard, Map } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";

// World map topography data - using a reliable source
const geoUrl = "https://unpkg.com/world-atlas@2/countries-110m.json";

export const AdminMetrics = () => {
  const { data: metrics, isLoading, error } = useVisitorMetrics();

  const { data: blogMetrics } = useQuery({
    queryKey: ["blogMetrics"],
    queryFn: async () => {
      const { data: blogs, error } = await supabase
        .from("blogs")
        .select("category, created_at")
        .order("created_at");
      
      if (error) {
        console.error("Error fetching blog metrics:", error);
        throw error;
      }

      if (!blogs) return [];

      const categoryCount = blogs.reduce((acc: Record<string, number>, blog) => {
        acc[blog.category] = (acc[blog.category] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value
      }));
    },
  });

  if (error) {
    console.error("Error loading metrics:", error);
    return <div>Error loading metrics. Please try again later.</div>;
  }

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

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
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.uniqueVisitors || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalUsers || 0}</div>
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
          <div className="h-[400px] w-full rounded-lg relative">
            <ComposableMap
              projectionConfig={{
                scale: 147,
              }}
              className="w-full h-full"
            >
              <ZoomableGroup center={[0, 0]} zoom={1}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#EAEAEC"
                        stroke="#D6D6DA"
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: "#F5F5F5", outline: 'none' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    ))
                  }
                </Geographies>
                {metrics?.geoData?.map((location: any, index: number) => (
                  location.latitude && location.longitude ? (
                    <Marker
                      key={index}
                      coordinates={[location.longitude, location.latitude]}
                      data-tooltip-id="location-tooltip"
                      data-tooltip-content={`${location.city || 'Unknown City'}, ${location.country || 'Unknown Country'}`}
                    >
                      <circle r={4} fill="#3b82f6" />
                    </Marker>
                  ) : null
                ))}
              </ZoomableGroup>
            </ComposableMap>
            <ReactTooltip id="location-tooltip" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blogMetrics || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};