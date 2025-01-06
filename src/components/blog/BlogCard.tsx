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
    <Card className="group h-full hover:shadow-lg transition-all duration-300 overflow-hidden bg-white">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-[#9b87f5] to-[#FFDEE2]">
          {blog.image_url ? (
            <img 
              src={blog.image_url} 
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/7fc08053-ed95-42cc-977f-c30db4dfbada.png"
                alt="Default blog illustration"
                className="w-1/2 h-1/2 object-contain opacity-75"
              />
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col gap-4 flex-grow">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20">
              {blog.category}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{blog.read_time_minutes} min read</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-[#9b87f5] transition-colors">
              {blog.title}
            </h2>
            <p className="text-gray-600 line-clamp-2 text-sm">
              {blog.excerpt}
            </p>
          </div>
          <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">
                By {blog.profiles?.email?.split('@')[0]}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(blog.published_at || blog.created_at!).toLocaleDateString()}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#9b87f5]/10">
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
      </CardContent>
    </Card>
  );
};