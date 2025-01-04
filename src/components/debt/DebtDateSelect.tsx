import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DebtDateSelectProps {
  date: Date;
  onSelect: (date: Date | undefined) => void;
}

export const DebtDateSelect = ({ date, onSelect }: DebtDateSelectProps) => {
  return (
    <div className="relative">
      <Label className="text-sm font-medium text-gray-700">Next Payment Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-white",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            initialFocus
            fromDate={new Date()} // Allow selection from today onwards
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};