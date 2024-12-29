import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "./RichTextEditor";
import { BlogContentNode } from "@/utils/blogContentUtils";

interface BlogFormContentProps {
  excerpt: string;
  content: string;
  onExcerptChange: (value: string) => void;
  onContentChange: (html: string, jsonContent?: BlogContentNode[]) => void;
}

export const BlogFormContent = ({
  excerpt,
  content,
  onExcerptChange,
  onContentChange,
}: BlogFormContentProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          placeholder="A brief summary of your post"
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          className="h-24"
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <RichTextEditor
          content={content}
          onChange={onContentChange}
        />
      </div>
    </div>
  );
};