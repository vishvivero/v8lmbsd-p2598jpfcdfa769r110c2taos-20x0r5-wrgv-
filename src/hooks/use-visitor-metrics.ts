import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useVisitorMetrics = () => {
  return useQuery({
    queryKey: ["visitor-metrics"],
    queryFn: async () => {
      console.log("Fetching visitor metrics");
      
      // Base query for visits
      let query = supabase
        .from("website_visits")
        .select("*", { count: 'exact' });

      const { data: visits, error: visitsError, count: totalVisits } = await query;

      if (visitsError) {
        console.error("Error fetching visits:", visitsError);
        throw visitsError;
      }

      console.log("Raw visits data:", visits);

      // Get unique visitors count
      const uniqueVisitorIds = new Set(visits?.map(visit => visit.visitor_id));

      // Get total profiles count
      const { count: totalProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (profilesError) {
        console.error("Error fetching profiles count:", profilesError);
        throw profilesError;
      }

      console.log("Total profiles:", totalProfiles);

      // Get total debts count
      const { count: totalDebts, error: debtsError } = await supabase
        .from('debts')
        .select('*', { count: 'exact' });

      if (debtsError) {
        console.error("Error fetching debts count:", debtsError);
        throw debtsError;
      }

      // Process visit trends
      const visitsByDate = visits?.reduce((acc: { [key: string]: number }, visit) => {
        const date = new Date(visit.visited_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const visitTrends = Object.entries(visitsByDate || {}).map(([date, visits]) => ({
        date,
        visits
      })).sort((a, b) => a.date.localeCompare(b.date));

      console.log("Processed visit trends:", visitTrends);

      return {
        totalVisits,
        uniqueVisitors: uniqueVisitorIds.size,
        totalDebts,
        totalProfiles,
        visitTrends,
        geoData: visits?.map(visit => ({
          latitude: visit.latitude,
          longitude: visit.longitude,
          value: 1
        })) || []
      };
    }
  });
};