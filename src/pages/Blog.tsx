import { BlogList } from "@/components/blog/BlogList";
import { BlogPost } from "@/components/blog/BlogPost";
import { Routes, Route } from "react-router-dom";
import { AdminBlogList } from "@/components/blog/AdminBlogList";
import { CategoryManager } from "@/components/blog/CategoryManager";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <Routes>
        <Route index element={<BlogList />} />
        <Route path=":slug" element={<BlogPost />} />
        {profile?.is_admin && (
          <>
            <Route path="admin" element={<AdminBlogList />} />
            <Route path="admin/categories" element={<CategoryManager />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default Blog;