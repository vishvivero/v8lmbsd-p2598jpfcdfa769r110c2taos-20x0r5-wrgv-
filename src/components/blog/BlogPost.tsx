import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const BlogPost = () => {
  const { slug } = useParams();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!blog) return <div>Blog post not found</div>;

  return (
    <article className="prose prose-lg max-w-4xl mx-auto">
      <h1>{blog.title}</h1>
      <div className="flex gap-2 my-4">
        <Badge variant="outline">{blog.category}</Badge>
        {blog.tags?.map((tag: string) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      <div
        className="mt-8"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <div className="text-sm text-muted-foreground mt-8">
        Published on {new Date(blog.published_at).toLocaleDateString()}
      </div>
    </article>
  );
};