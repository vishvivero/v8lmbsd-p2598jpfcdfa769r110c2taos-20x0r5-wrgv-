import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUpload } from "./ImageUpload";

interface BlogPostFormState {
  title: string;
  content: string;
  jsonContent?: any;
  excerpt: string;
  category: string;
  isPublished: boolean;
  image: File | null;
  imagePreview: string | null;
}

export const BlogPostForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formState, setFormState] = useState<BlogPostFormState>({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    isPublished: false,
    image: null,
    imagePreview: null,
  });

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
      setFormState({
        title: existingPost.title,
        content: existingPost.content,
        excerpt: existingPost.excerpt,
        category: existingPost.category,
        isPublished: existingPost.is_published,
        image: null,
        imagePreview: existingPost.image_url,
      });
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

  const handleImageChange = (file: File) => {
    setFormState(prev => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error } = await supabase.storage
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
      if (formState.image) {
        imageUrl = await uploadImage(formState.image);
      }

      const readTimeMinutes = calculateReadTime(formState.content);

      const { error } = await supabase
        .from("blogs")
        .update({
          title: formState.title,
          content: formState.content,
          excerpt: formState.excerpt,
          category: formState.category,
          is_published: formState.isPublished,
          published_at: formState.isPublished ? new Date().toISOString() : null,
          image_url: imageUrl,
          read_time_minutes: readTimeMinutes,
          updated_at: new Date().toISOString(),
          json_content: formState.jsonContent,
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
      const slug = `${formState.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}-${timestamp}`;

      let imageUrl = null;
      if (formState.image) {
        imageUrl = await uploadImage(formState.image);
      }

      const readTimeMinutes = calculateReadTime(formState.content);

      const { error } = await supabase.from("blogs").insert([
        {
          title: formState.title,
          slug,
          content: formState.content,
          excerpt: formState.excerpt,
          category: formState.category,
          author_id: user.id,
          is_published: formState.isPublished,
          published_at: formState.isPublished ? new Date().toISOString() : null,
          image_url: imageUrl,
          read_time_minutes: readTimeMinutes,
          json_content: formState.jsonContent,
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
    if (!formState.title.trim() || !formState.content.trim() || !formState.excerpt.trim() || !formState.category) {
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
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Post Title"
            value={formState.title}
            onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
            className="text-lg font-semibold"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formState.category} 
            onValueChange={(value) => setFormState(prev => ({ ...prev, category: value }))}
          >
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

        <ImageUpload 
          imagePreview={formState.imagePreview} 
          onImageChange={handleImageChange} 
        />

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            placeholder="A brief summary of your post"
            value={formState.excerpt}
            onChange={(e) => setFormState(prev => ({ ...prev, excerpt: e.target.value }))}
            className="h-24"
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <RichTextEditor
            content={formState.content}
            onChange={(html, jsonContent) => 
              setFormState(prev => ({ 
                ...prev, 
                content: html,
                jsonContent 
              }))
            }
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={createPost.isPending || updatePost.isPending}
          >
            {formState.isPublished ? "Publish" : "Save as Draft"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormState(prev => ({ ...prev, isPublished: !prev.isPublished }))}
          >
            {formState.isPublished ? "Switch to Draft" : "Switch to Publish"}
          </Button>
        </div>
      </div>
    </form>
  );
};
