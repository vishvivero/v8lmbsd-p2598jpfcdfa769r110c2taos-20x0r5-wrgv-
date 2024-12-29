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

      const { data: visits, count: totalVisits, error: visitsError } = await query;
      
      if (visitsError) {
        console.error("Error fetching visits:", visitsError);
        throw visitsError;
      }

      // Get unique visitors count
      const { data: uniqueVisitors, error: uniqueError } = await supabase
        .from("website_visits")
        .select('visitor_id');

      if (uniqueError) {
        console.error("Error fetching unique visitors:", uniqueError);
        throw uniqueError;
      }

      // Get unique visitor count by using Set
      const uniqueVisitorIds = new Set(uniqueVisitors?.map(v => v.visitor_id));

      // Get total profiles count with detailed error logging
      const { count: totalProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true });

      if (profilesError) {
        console.error("Error fetching total profiles:", profilesError);
        console.error("Profiles error details:", profilesError.message, profilesError.details);
        throw profilesError;
      }

      console.log("Successfully fetched total profiles count:", totalProfiles);

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
    },
  });
}