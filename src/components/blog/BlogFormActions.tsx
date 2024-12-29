import { Button } from "@/components/ui/button";

interface BlogFormActionsProps {
  isPublished: boolean;
  isPending: boolean;
  onTogglePublish: () => void;
  onSubmit: () => void;
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
        onClick={onSubmit}
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