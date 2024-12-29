import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const BlogMetricsChart = () => {
  const { data: blogMetrics, isLoading, error } = useQuery({
    queryKey: ["blogMetrics"],
    queryFn: async () => {
      console.log("Fetching blog metrics...");
      const { data: blogs, error } = await supabase
        .from("blogs")
        .select("category, created_at")
        .order("created_at");
      
      if (error) {
        console.error("Error fetching blog metrics:", error);
        throw error;
      }

      if (!blogs) {
        console.log("No blog data found");
        return [];
      }

      console.log("Fetched blogs for metrics:", blogs);

      const categoryCount = blogs.reduce((acc: Record<string, number>, blog) => {
        acc[blog.category] = (acc[blog.category] || 0) + 1;
        return acc;
      }, {});

      const metrics = Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value
      }));

      console.log("Processed blog metrics:", metrics);
      return metrics;
    },
  });

  if (error) {
    console.error("Error in BlogMetricsChart:", error);
    return <div>Error loading blog metrics</div>;
  }

  if (isLoading) {
    return <div>Loading blog metrics...</div>;
  }

  if (!blogMetrics?.length) {
    return <div>No blog data available</div>;
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={blogMetrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};