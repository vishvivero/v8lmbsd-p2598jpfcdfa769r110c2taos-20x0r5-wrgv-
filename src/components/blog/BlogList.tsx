import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface BlogListProps {
  isAdminView?: boolean;
}

export const BlogList = ({ isAdminView = false }: BlogListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: categories } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: async () => {
      console.log("Fetching blog categories...");
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      console.log("Fetched categories:", data);
      return data;
    },
  });

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["publicBlogs", searchTerm, selectedCategory, isAdminView],
    queryFn: async () => {
      console.log("Fetching blogs with filters:", { searchTerm, selectedCategory, isAdminView });
      let query = supabase
        .from("blogs")
        .select("*, profiles(email)");

      if (!isAdminView) {
        query = query.eq("is_published", true);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      if (selectedCategory && selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      query = query.order("published_at", { ascending: false });

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }
      console.log("Fetched blogs:", data);
      return data;
    },
  });

  if (isLoading) return <div>Loading blogs...</div>;

  return (
    <div className="pt-4">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4 mb-8">
          <Input 
            placeholder="Search blogs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <Link 
              to={`/blog/${blog.slug}`} 
              key={blog.id} 
              className="group rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {blog.image_url && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={blog.image_url} 
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{blog.read_time_minutes} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!blog.is_published && (
                      <Badge variant="outline" className="bg-yellow-50">Draft</Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {blogs?.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No blog posts found.</p>
        )}
      </div>
    </div>
  );
};