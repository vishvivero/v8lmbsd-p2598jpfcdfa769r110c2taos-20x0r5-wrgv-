import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPostForm } from "@/components/blog/BlogPostForm";

export const NewPost = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogPostForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPost;