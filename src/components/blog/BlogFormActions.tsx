import { Button } from "@/components/ui/button";

interface BlogFormActionsProps {
  isPublished: boolean;
  isPending: boolean;
  onTogglePublish: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BlogFormActions = ({
  isPublished,
  isPending,
  onTogglePublish,
  onSubmit,
}: BlogFormActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        type="submit"
        disabled={isPending}
        onClick={(e) => onSubmit(e)}
      >
        {isPublished ? "Publish" : "Save as Draft"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onTogglePublish}
      >
        {isPublished ? "Switch to Draft" : "Switch to Publish"}
      </Button>
    </div>
  );
};