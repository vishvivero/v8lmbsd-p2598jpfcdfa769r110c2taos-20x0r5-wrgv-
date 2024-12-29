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

  const { data: blogCategories } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching blog categories:", error);
        throw error;
      }
      return data;
    },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/admin" element={<AdminBlogList />} />
        <Route path="/post/:slug" element={<BlogPost />} />
        {user?.is_admin && (
          <Route path="/categories" element={<CategoryManager />} />
        )}
      </Routes>
    </Suspense>
  );
};

export default Blog;
