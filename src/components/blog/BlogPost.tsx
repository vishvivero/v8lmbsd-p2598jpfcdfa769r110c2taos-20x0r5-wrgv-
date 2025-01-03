import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const BlogPost = () => {
  const { slug } = useParams();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      console.log("Fetching blog post with slug:", slug);
      const { data, error } = await supabase
        .from("blogs")
        .select("*, profiles(email)")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching blog post:", error);
        throw error;
      }

      if (!data) {
        console.log("Blog post not found:", slug);
        return null;
      }

      return data;
    },
    enabled: !!slug,
  });

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading blog post. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="animate-pulse p-6">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </Card>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert>
          <AlertDescription>
            Blog post not found. The post might have been removed or unpublished.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden"
    >
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
    </motion.article>
  );
};