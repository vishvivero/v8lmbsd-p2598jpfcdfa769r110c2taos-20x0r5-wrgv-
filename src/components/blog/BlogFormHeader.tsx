import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";

interface BlogFormHeaderProps {
  title: string;
  category: string;
  imagePreview: string | null;
  categories?: { id: string; name: string; slug: string }[];
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onImageChange: (file: File) => void;
}

export const BlogFormHeader = ({
  title,
  category,
  imagePreview,
  categories,
  onTitleChange,
  onCategoryChange,
  onImageChange,
}: BlogFormHeaderProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Post Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-lg font-semibold"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
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

      <ImageUpload imagePreview={imagePreview} onImageChange={onImageChange} />
    </div>
  );
};