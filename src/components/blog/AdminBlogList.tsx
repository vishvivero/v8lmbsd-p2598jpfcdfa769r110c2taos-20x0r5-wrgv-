import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { PlusCircle, FileEdit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

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
      
      // First verify admin status
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

      // Then fetch blogs
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
    onError: (error) => {
      console.error("Error in admin blogs query:", error);
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const publishedPosts = blogs?.filter(blog => blog.is_published === true) || [];
  const draftPosts = blogs?.filter(blog => blog.is_published === false) || [];

  console.log("Filtered posts:", {
    published: publishedPosts.length,
    drafts: draftPosts.length
  });

  const BlogTable = ({ posts }: { posts: typeof blogs }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts?.map((blog) => (
          <TableRow key={blog.id}>
            <TableCell>{blog.title}</TableCell>
            <TableCell>{blog.category}</TableCell>
            <TableCell>
              <Badge variant={blog.is_published ? "default" : "secondary"}>
                {blog.is_published ? "Published" : "Draft"}
              </Badge>
            </TableCell>
            <TableCell>
              {blog.updated_at
                ? new Date(blog.updated_at).toLocaleDateString()
                : "-"}
            </TableCell>
            <TableCell>
              <Link to={`/admin/edit/${blog.id}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FileEdit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
        <Link to="/admin/new">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Posts ({blogs?.length || 0})</TabsTrigger>
          <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <BlogTable posts={blogs} />
        </TabsContent>

        <TabsContent value="published">
          <BlogTable posts={publishedPosts} />
        </TabsContent>

        <TabsContent value="drafts">
          <BlogTable posts={draftPosts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};