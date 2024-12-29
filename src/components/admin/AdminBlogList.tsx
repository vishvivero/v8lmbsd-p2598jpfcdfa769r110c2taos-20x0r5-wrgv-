import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { AdminLoadingSpinner } from "../blog/AdminLoadingSpinner";
import { AdminBlogTable } from "../blog/AdminBlogTable";
import { AdminBlogHeader } from "../blog/AdminBlogHeader";
import { ChartBar, List, PenTool } from "lucide-react";

export const AdminBlogList = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["adminBlogs", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("No user ID available for admin blogs fetch");
        throw new Error("User ID is required");
      }

      console.log("Fetching admin blogs for user:", user.id);
      
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching admin profile:", profileError);
        throw profileError;
      }

      console.log("Admin profile check:", profile);

      if (!profile?.is_admin) {
        console.log("User is not an admin");
        throw new Error("Unauthorized");
      }

      const { data: blogData, error: blogsError } = await supabase
        .from("blogs")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false });

      if (blogsError) {
        console.error("Error fetching blogs:", blogsError);
        throw blogsError;
      }
      
      console.log("Successfully fetched blogs:", blogData?.length);
      return blogData;
    },
    enabled: !!user?.id,
    meta: {
      errorMessage: "Failed to load blog posts. Please try again."
    },
    retry: false,
  });

  React.useEffect(() => {
    if (!isLoading && !blogs) {
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      });
    }
  }, [isLoading, blogs, toast]);

  if (isLoading) {
    return <AdminLoadingSpinner />;
  }

  const publishedPosts = blogs?.filter(blog => blog.is_published === true) || [];
  const draftPosts = blogs?.filter(blog => blog.is_published === false) || [];

  console.log("Filtered posts:", {
    published: publishedPosts.length,
    drafts: draftPosts.length
  });

  return (
    <div className="space-y-6">
      <AdminBlogHeader />
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            All Posts ({blogs?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="published" className="flex items-center gap-2">
            <ChartBar className="w-4 h-4" />
            Published ({publishedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            Drafts ({draftPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AdminBlogTable posts={blogs} />
        </TabsContent>

        <TabsContent value="published">
          <AdminBlogTable posts={publishedPosts} />
        </TabsContent>

        <TabsContent value="drafts">
          <AdminBlogTable posts={draftPosts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};