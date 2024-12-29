import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AdminBlogList } from "@/components/blog/AdminBlogList";
import { BlogList } from "@/components/blog/BlogList";
import { BlogPost } from "@/components/blog/BlogPost";
import { CategoryManager } from "@/components/blog/CategoryManager";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<BlogList />} />
        {profile?.is_admin && (
          <>
            <Route path="/admin" element={<AdminBlogList />} />
            <Route path="/categories" element={<CategoryManager />} />
          </>
        )}
        <Route path="/post/:slug" element={<BlogPost />} />
      </Routes>
    </Suspense>
  );
};

export default Blog;