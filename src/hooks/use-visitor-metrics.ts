import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useVisitorMetrics(dateRange?: { start: Date; end: Date }) {
  return useQuery({
    queryKey: ["visitor-metrics", dateRange],
    queryFn: async () => {
      console.log("Fetching visitor metrics with date range:", dateRange);
      
      // Base query for visits
      let query = supabase
        .from("website_visits")
        .select("*", { count: 'exact' });

      // Apply date range filter if provided
      if (dateRange) {
        query = query.gte('visited_at', dateRange.start.toISOString())
                    .lte('visited_at', dateRange.end.toISOString());
      }

      const { data: visits, count: totalVisits, error: visitsError } = await query;
      
      if (visitsError) {
        console.error("Error fetching visits:", visitsError);
        throw visitsError;
      }

      console.log("Raw visits data:", visits);

      // Get unique visitors count
      const uniqueVisitorIds = new Set(visits?.map(visit => visit.visitor_id));

      // Get total debts
      const { count: totalDebts, error: debtsError } = await supabase
        .from("debts")
        .select("*", { count: 'exact', head: true });

      if (debtsError) {
        console.error("Error fetching debts:", debtsError);
        throw debtsError;
      }

      // Process daily visits into a format suitable for the chart
      const dailyVisitCounts = visits?.reduce((acc: Record<string, number>, visit) => {
        const date = new Date(visit.visited_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Convert to array format for the chart and sort by date
      const visitTrends = Object.entries(dailyVisitCounts || {})
        .map(([date, visits]) => ({
          date,
          visits
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      console.log("Processed visit trends:", visitTrends);

      // Get geographical data for the map
      const { data: geoData, error: geoError } = await supabase
        .from("website_visits")
        .select("latitude, longitude, country, city")
        .not("latitude", "is", null)
        .not("longitude", "is", null);

      if (geoError) {
        console.error("Error fetching geo data:", geoError);
        throw geoError;
      }

      return {
        totalVisits: totalVisits || 0,
        uniqueVisitors: uniqueVisitorIds.size || 0,
        totalDebts: totalDebts || 0,
        geoData: geoData || [],
        visitTrends: visitTrends || []
      };
    },
    retry: 1,
  });
}