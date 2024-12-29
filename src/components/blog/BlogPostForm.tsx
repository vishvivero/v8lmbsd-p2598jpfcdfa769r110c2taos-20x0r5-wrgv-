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

export const BlogPostForm = () => {
  const { id } = useParams(); // Get the blog post ID from URL if editing
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);
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
    enabled: !!id, // Only run query if we have an ID
  });

  // Populate form with existing data when available
  useEffect(() => {
    if (existingPost) {
      console.log("Setting form data from existing post:", existingPost);
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setExcerpt(existingPost.excerpt);
      setCategory(existingPost.category);
      setIsPublished(existingPost.is_published);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
          is_published: isPublished,
          published_at: isPublished ? new Date().toISOString() : null,
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
          is_published: isPublished,
          published_at: isPublished ? new Date().toISOString() : null,
          image_url: imageUrl,
          read_time_minutes: readTimeMinutes,
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
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
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
          <Label htmlFor="image">Featured Image</Label>
          <div className="mt-1 flex items-center space-x-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-20 w-20 object-cover rounded"
              />
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            placeholder="A brief summary of your post"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="h-24"
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-64"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={createPost.isPending || updatePost.isPending}
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
