import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export const BlogPostForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const createPost = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const { error } = await supabase.from("blogs").insert([
        {
          title,
          slug,
          content,
          excerpt,
          category,
          author_id: user.id,
          is_published: isPublished,
          published_at: isPublished ? new Date().toISOString() : null,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      navigate("/blog/admin");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create blog post",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !excerpt.trim() || !category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }
    createPost.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold"
          />
        </div>

        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Textarea
            placeholder="Excerpt (A brief summary of your post)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="h-24"
          />
        </div>

        <div>
          <Textarea
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-64"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={createPost.isPending}
          >
            {isPublished ? "Publish" : "Save as Draft"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPublished(!isPublished)}
          >
            {isPublished ? "Switch to Draft" : "Switch to Publish"}
          </Button>
        </div>
      </div>
    </form>
  );
};