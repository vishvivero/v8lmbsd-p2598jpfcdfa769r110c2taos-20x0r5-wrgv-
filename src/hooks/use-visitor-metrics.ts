import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useVisitorMetrics(dateRange?: { start: Date; end: Date }) {
  return useQuery({
    queryKey: ["visitor-metrics", dateRange],
    queryFn: async () => {
      console.log("Fetching visitor metrics with date range:", dateRange);
      
      try {
        // Base query for total visits
        const visitsQuery = supabase
          .from("website_visits")
          .select("*", { count: 'exact' });

        // Apply date range filter if provided
        if (dateRange) {
          visitsQuery.gte('visited_at', dateRange.start.toISOString())
                    .lte('visited_at', dateRange.end.toISOString());
        }

        const { count: totalVisits, error: visitsError } = await visitsQuery;
        
        if (visitsError) {
          console.error("Error fetching visits:", visitsError);
          throw visitsError;
        }

        // Get unique visitors count
        const { data: uniqueVisitors, error: uniqueError } = await supabase
          .from("website_visits")
          .select('visitor_id', { count: 'exact' })
          .limit(1000);

        if (uniqueError) {
          console.error("Error fetching unique visitors:", uniqueError);
          throw uniqueError;
        }

        // Get unique visitor count by using Set
        const uniqueVisitorIds = new Set(uniqueVisitors?.map(v => v.visitor_id));

        // Get total profiles count
        const { count: totalProfiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*", { count: 'exact', head: true });

        if (profilesError) {
          console.error("Error fetching total profiles:", profilesError);
          throw profilesError;
        }

        // Get total debts
        const { count: totalDebts, error: debtsError } = await supabase
          .from("debts")
          .select("*", { count: 'exact', head: true });

        if (debtsError) {
          console.error("Error fetching debts:", debtsError);
          throw debtsError;
        }

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

        const metrics = {
          totalVisits: totalVisits || 0,
          uniqueVisitors: uniqueVisitorIds.size || 0,
          totalProfiles: totalProfiles || 0,
          totalDebts: totalDebts || 0,
          geoData: geoData || [],
        };

        console.log("Final metrics data:", metrics);
        return metrics;
      } catch (error) {
        console.error("Error in useVisitorMetrics:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
  });
}