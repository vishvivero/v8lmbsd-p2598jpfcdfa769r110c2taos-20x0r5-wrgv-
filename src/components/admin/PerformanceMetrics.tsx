import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Zap, Clock, Database } from "lucide-react";

export const PerformanceMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["performanceMetrics"],
    queryFn: async () => {
      console.log("Fetching performance metrics...");
      const { data: sessions, error: sessionsError } = await supabase
        .from("user_sessions")
        .select("count")
        .gt("last_active", new Date(Date.now() - 15 * 60 * 1000).toISOString());

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
        throw sessionsError;
      }

      console.log("Fetched performance metrics:", { activeSessions: sessions?.[0]?.count });
      return {
        activeSessions: sessions?.[0]?.count || 0,
        averageResponseTime: "120ms",
        databaseSize: "1.2GB",
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.activeSessions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.averageResponseTime}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.databaseSize}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Response Time Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { time: "1h ago", value: 120 },
                  { time: "2h ago", value: 115 },
                  { time: "3h ago", value: 130 },
                  { time: "4h ago", value: 125 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
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