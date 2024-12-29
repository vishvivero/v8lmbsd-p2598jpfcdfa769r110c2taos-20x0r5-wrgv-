import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminMetrics = () => {
  const { data: blogMetrics } = useQuery({
    queryKey: ["blogMetrics"],
    queryFn: async () => {
      const { data: blogs, error } = await supabase
        .from("blogs")
        .select("category, created_at")
        .order("created_at");
      
      if (error) throw error;

      // Group blogs by category
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

  const { data: userCount } = useQuery({
    queryKey: ["userCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true });
      
      if (error) throw error;
      return count;
    },
  });

  const { data: blogCount } = useQuery({
    queryKey: ["blogCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("blogs")
        .select("*", { count: 'exact', head: true });
      
      if (error) throw error;
      return count;
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{blogCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posts by Category</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};