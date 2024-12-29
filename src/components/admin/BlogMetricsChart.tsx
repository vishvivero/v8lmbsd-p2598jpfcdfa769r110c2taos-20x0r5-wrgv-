import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const BlogMetricsChart = () => {
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

  return (
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
  );
};