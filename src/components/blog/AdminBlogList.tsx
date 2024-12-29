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

export const AdminBlogList = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["adminBlogs"],
    queryFn: async () => {
      console.log("Fetching admin blogs...");
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile?.is_admin) {
        throw new Error("Unauthorized");
      }

      const { data, error } = await supabase
        .from("blogs")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }
      console.log("Fetched blogs:", data);
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const publishedPosts = blogs?.filter(blog => blog.is_published) || [];
  const draftPosts = blogs?.filter(blog => !blog.is_published) || [];

  console.log("Published posts:", publishedPosts);
  console.log("Draft posts:", draftPosts);

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
          <TabsTrigger value="all">All Posts</TabsTrigger>
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