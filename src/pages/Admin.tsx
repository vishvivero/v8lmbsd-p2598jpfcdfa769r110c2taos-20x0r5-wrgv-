import { useState } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { AdminMetrics } from "@/components/admin/AdminMetrics";
import { AdminBlogList } from "@/components/admin/AdminBlogList";
import { BlogPostForm } from "@/components/blog/BlogPostForm";
import { CategoryManager } from "@/components/blog/CategoryManager";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Link 
              to="/" 
              className="text-primary hover:underline"
            >
              Back to Home
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 bg-white p-4 rounded-lg shadow">
              <nav className="space-y-2">
                <Link 
                  to="/admin" 
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/blogs" 
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  Manage Blogs
                </Link>
                <Link 
                  to="/admin/categories" 
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  Manage Categories
                </Link>
                <Link 
                  to="/admin/new-post" 
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  New Blog Post
                </Link>
              </nav>
            </div>

            <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-lg shadow">
              <Routes>
                <Route index element={<AdminMetrics />} />
                <Route path="blogs/*" element={<AdminBlogList />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="new-post" element={<BlogPostForm />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;