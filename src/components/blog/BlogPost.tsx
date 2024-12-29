import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";

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
      <div className="mb-6">
        <Link to="/blog">
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/5">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
      
      <article className="bg-white rounded-lg shadow-sm">
        <header className="mb-8 p-6 md:p-8 border-b">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {blog.category}
            </Badge>
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
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </header>

        <div className="px-6 md:px-8 pb-8">
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary hover:prose-a:text-primary/80 prose-a:transition-colors prose-strong:text-gray-900 prose-em:text-gray-800 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-blockquote:border-l-primary prose-blockquote:text-gray-700 prose-img:rounded-lg prose-hr:border-gray-200">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string) => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className="bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};