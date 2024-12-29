import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose lg:prose-xl mx-auto">
        <header className="not-prose mb-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <Badge variant="secondary">{blog.category}</Badge>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{blog.read_time_minutes} min read</span>
            </div>
            <span>
              {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          {blog.image_url && (
            <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8">
              <img 
                src={blog.image_url} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t not-prose">
            <div className="flex gap-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};