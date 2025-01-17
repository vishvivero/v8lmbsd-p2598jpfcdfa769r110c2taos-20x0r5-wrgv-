import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { AdminMetrics } from "@/components/admin/AdminMetrics";
import { AdminBlogList } from "@/components/admin/AdminBlogList";
import { BlogPostForm } from "@/components/blog/BlogPostForm";
import { CategoryManager } from "@/components/blog/CategoryManager";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { SecurityMonitoring } from "@/components/admin/SecurityMonitoring";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { AnalyticsReporting } from "@/components/admin/AnalyticsReporting";
import { AuditLogs } from "@/components/admin/AuditLogs";
import { PerformanceMetrics } from "@/components/admin/PerformanceMetrics";

const Admin = () => {
  const { user } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5
  });

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile?.is_admin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            You do not have permission to access this area.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <MainLayout sidebar={<AdminSidebar />}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <Routes>
            <Route index element={<AdminMetrics />} />
            <Route path="blogs" element={<AdminBlogList />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="new-post" element={<BlogPostForm />} />
            <Route path="edit/:id" element={<BlogPostForm />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="security" element={<SecurityMonitoring />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="analytics" element={<AnalyticsReporting />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="performance" element={<PerformanceMetrics />} />
          </Routes>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;