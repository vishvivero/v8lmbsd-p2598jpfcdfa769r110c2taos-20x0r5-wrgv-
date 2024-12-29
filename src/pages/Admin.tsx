import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminBlogList } from "@/components/blog/AdminBlogList";
import { CategoryManager } from "@/components/blog/CategoryManager";
import { AdminMetrics } from "@/components/admin/AdminMetrics";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ChartBar, PenTool, List } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!isLoading && (!user || !profile?.is_admin)) {
      navigate("/");
    }
  }, [user, profile, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <Settings className="w-8 h-8" />
              Admin Dashboard
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <ChartBar className="w-4 h-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="blog-posts" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <AdminMetrics />
          </TabsContent>

          <TabsContent value="blog-posts">
            <AdminBlogList />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}