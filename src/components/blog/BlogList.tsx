import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface BlogListProps {
  isAdminView?: boolean;
}

export const BlogList = ({ isAdminView = false }: BlogListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["publicBlogs", searchTerm, selectedCategory, isAdminView],
    queryFn: async () => {
      let query = supabase
        .from("blogs")
        .select("*, profiles(email)");

      // Only filter by is_published if not in admin view
      if (!isAdminView) {
        query = query.eq("is_published", true);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      query = query.order("published_at", { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading blogs...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      
      <div className="flex space-x-4 mb-6">
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
            <SelectItem value="">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.name}>
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
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4">{blog.excerpt}</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">{blog.category}</Badge>
                <div className="flex items-center gap-2">
                  {!blog.is_published && (
                    <Badge variant="outline" className="bg-yellow-50">Draft</Badge>
                  )}
                  <span className="text-sm text-gray-500">
                    {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : 'Not published'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {blogs?.length === 0 && (
        <p className="text-center text-gray-500">No blog posts found.</p>
      )}
    </div>
  );
};