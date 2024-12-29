import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const BlogPost = () => {
  const { slug } = useParams();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*, profiles(email)")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading blog post...</div>;
  if (!blog) return <div>Blog post not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <Badge variant="secondary">{blog.category}</Badge>
            <span>
              Published on {new Date(blog.published_at).toLocaleDateString()}
            </span>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex space-x-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
};