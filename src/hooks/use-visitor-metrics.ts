import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useVisitorMetrics(dateRange?: { start: Date; end: Date }) {
  return useQuery({
    queryKey: ["visitor-metrics", dateRange],
    queryFn: async () => {
      console.log("Fetching visitor metrics with date range:", dateRange);
      
      // Base query for total visits
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

      // Get unique visitors count
      const { data: uniqueVisitors, error: uniqueError } = await supabase
        .from("website_visits")
        .select('visitor_id')
        .limit(1000);

      if (uniqueError) {
        console.error("Error fetching unique visitors:", uniqueError);
        throw uniqueError;
      }

      // Get unique visitor count by using Set
      const uniqueVisitorIds = new Set(uniqueVisitors?.map(v => v.visitor_id));

      // Get total debts
      const { count: totalDebts, error: debtsError } = await supabase
        .from("debts")
        .select("*", { count: 'exact', head: true });

      if (debtsError) {
        console.error("Error fetching debts:", debtsError);
        throw debtsError;
      }

      // Get daily visitor counts for the trend chart
      const { data: dailyVisits, error: dailyError } = await supabase
        .from('website_visits')
        .select('visited_at')
        .order('visited_at', { ascending: true });

      if (dailyError) {
        console.error("Error fetching daily visits:", dailyError);
        throw dailyError;
      }

      // Process daily visits into a format suitable for the chart
      const dailyVisitCounts = dailyVisits?.reduce((acc: Record<string, number>, visit) => {
        const date = new Date(visit.visited_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Convert to array format for the chart
      const visitTrends = Object.entries(dailyVisitCounts || {}).map(([date, count]) => ({
        date,
        visits: count
      }));

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

      console.log("Fetched metrics data:", {
        totalVisits,
        uniqueVisitors: uniqueVisitorIds.size,
        totalDebts,
        geoDataPoints: geoData?.length,
        dailyTrends: visitTrends
      });

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