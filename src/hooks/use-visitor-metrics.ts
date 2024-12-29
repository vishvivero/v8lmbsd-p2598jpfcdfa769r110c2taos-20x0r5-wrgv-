import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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

      const { count: totalVisits } = await query;

      // Get unique visitors count using distinct
      const { data: uniqueVisitorsData } = await supabase
        .from("website_visits")
        .select('visitor_id')
        .limit(1);

      // Get total signed up users
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: 'exact' });

      // Get total debts
      const { count: totalDebts } = await supabase
        .from("debts")
        .select("*", { count: 'exact' });

      // Get geographical data for the map
      const { data: geoData } = await supabase
        .from("website_visits")
        .select("latitude, longitude, country, city")
        .not("latitude", "is", null);

      return {
        totalVisits: totalVisits || 0,
        uniqueVisitors: uniqueVisitorsData?.length || 0,
        totalUsers: totalUsers || 0,
        totalDebts: totalDebts || 0,
        geoData: geoData || [],
      };
    },
  });
}