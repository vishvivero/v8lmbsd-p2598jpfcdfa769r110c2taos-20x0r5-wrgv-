import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BlogFormFields } from "./BlogFormFields";
import { MarkdownPreview } from "./MarkdownPreview";

export const BlogPostForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch existing blog post data if editing
  const { data: existingPost } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      if (!id) return null;
      console.log("Fetching blog post:", id);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching blog post:", error);
        throw error;
      }
      console.log("Fetched blog post:", data);
      return data;
    },
    enabled: !!id,
  });

  // Populate form with existing data when available
  useEffect(() => {
    if (existingPost) {
      console.log("Setting form data from existing post:", existingPost);
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setExcerpt(existingPost.excerpt);
      setCategory(existingPost.category);
      if (existingPost.image_url) {
        setImagePreview(existingPost.image_url);
      }
    }
  }, [existingPost]);

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

  const calculateReadTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const updatePost = useMutation({
    mutationFn: async () => {
      if (!user?.id || !id) throw new Error("Unauthorized or invalid post ID");

      let imageUrl = existingPost?.image_url;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const readTimeMinutes = calculateReadTime(content);

      const { error } = await supabase
        .from("blogs")
        .update({
          title,
          content,
          excerpt,
          category,
          is_published: true,
          published_at: new Date().toISOString(),
          image_url: imageUrl,
          read_time_minutes: readTimeMinutes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      navigate("/blog/admin");
    },
    onError: (error) => {
      console.error("Error updating blog post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update blog post",
      });
    },
  });

  const createPost = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const timestamp = new Date().getTime();
      const slug = `${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}-${timestamp}`;

      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const readTimeMinutes = calculateReadTime(content);

      const { error } = await supabase.from("blogs").insert([
        {
          title,
          slug,
          content,
          excerpt,
          category,
          author_id: user.id,
          is_published: true,
          published_at: new Date().toISOString(),
          image_url: imageUrl,
          read_time_minutes: readTimeMinutes,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post published successfully",
      });
      navigate("/blog/admin");
    },
    onError: (error) => {
      console.error("Error creating blog post:", error);
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
    if (id) {
      updatePost.mutate();
    } else {
      createPost.mutate();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BlogFormFields
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        excerpt={excerpt}
        setExcerpt={setExcerpt}
        category={category}
        setCategory={setCategory}
        categories={categories}
        image={image}
        setImage={setImage}
        imagePreview={setImagePreview}
      />

      <MarkdownPreview content={content} />

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={createPost.isPending || updatePost.isPending}
        >
          Publish Post
        </Button>
      </div>
    </form>
  );
};