import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { AdminBlogList } from "@/components/blog/AdminBlogList";
import { BlogList } from "@/components/blog/BlogList";
import { BlogPost } from "@/components/blog/BlogPost";
import { CategoryManager } from "@/components/blog/CategoryManager";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
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
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex-1 w-full bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="w-full container mx-auto">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full container mx-auto px-4 py-16">
        <Suspense fallback={
          <div className="max-w-4xl mx-auto">
            Loading...
          </div>
        }>
          <Routes>
            <Route path="/" element={<BlogList />} />
            {profile?.is_admin ? (
              <>
                <Route path="/admin" element={<AdminBlogList />} />
                <Route path="/categories" element={<CategoryManager />} />
              </>
            ) : (
              <Route path="/admin" element={<Navigate to="/blog" replace />} />
            )}
            <Route path="/post/:slug" element={<BlogPost />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default Blog;