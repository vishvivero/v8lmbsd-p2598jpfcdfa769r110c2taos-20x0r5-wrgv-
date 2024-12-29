import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
}

export const ImageUpload = ({ imagePreview, onImageChange }: ImageUploadProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
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
  );
};