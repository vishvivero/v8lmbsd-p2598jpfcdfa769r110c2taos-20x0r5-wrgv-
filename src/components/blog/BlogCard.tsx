import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Facebook, Link, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    read_time_minutes: number;
    image_url: string | null;
    published_at: string | null;
    created_at: string | null;
    slug: string;
    profiles?: {
      email: string | null;
    };
  };
}

export const BlogCard = ({ blog }: BlogCardProps) => {
  const handleShare = async (platform: string) => {
    const url = `${window.location.origin}/blog/post/${blog.slug}`;
    const text = `Check out this blog post: ${blog.title}`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex flex-col h-full">
        {blog.image_url && (
          <div className="aspect-[16/9] mb-4 overflow-hidden rounded-lg">
            <img 
              src={blog.image_url} 
              alt={blog.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="flex flex-col gap-4 flex-grow">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {blog.category}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{blog.read_time_minutes} min read</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2 line-clamp-2">{blog.title}</h2>
            <p className="text-gray-600 line-clamp-3">{blog.excerpt}</p>
          </div>
          <div className="mt-auto pt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              By {blog.profiles?.email}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {new Date(blog.published_at || blog.created_at!).toLocaleDateString()}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Link className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShare('twitter')}>
                    <Twitter className="h-4 w-4 mr-2" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('facebook')}>
                    <Facebook className="h-4 w-4 mr-2" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('copy')}>
                    <Link className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};