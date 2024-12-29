import { useState } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminMetrics } from "@/components/admin/AdminMetrics";
import { AdminBlogList } from "@/components/admin/AdminBlogList";
import { BlogPostForm } from "@/components/blog/BlogPostForm";
import { CategoryManager } from "@/components/blog/CategoryManager";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-1 gap-4 relative">
            {/* Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-sm hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            <div className="flex gap-4">
              {/* Sidebar */}
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  sidebarOpen ? "w-64" : "w-0 overflow-hidden"
                )}
              >
                <div className="bg-white rounded-lg shadow p-4">
                  <nav className="space-y-2">
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 rounded hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/blogs" 
                      className="block px-4 py-2 rounded hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors"
                    >
                      Manage Blogs
                    </Link>
                    <Link 
                      to="/admin/categories" 
                      className="block px-4 py-2 rounded hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors"
                    >
                      Manage Categories
                    </Link>
                    <Link 
                      to="/admin/new-post" 
                      className="block px-4 py-2 rounded hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors"
                    >
                      New Blog Post
                    </Link>
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-white p-6 rounded-lg shadow">
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
    </div>
  );
};

export default Admin;