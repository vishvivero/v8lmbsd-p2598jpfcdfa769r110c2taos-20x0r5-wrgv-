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
        <PopoverContent 
          className="w-auto p-0 bg-white shadow-lg rounded-md border"
          align="start"
          side="bottom"
          sideOffset={4}
          forceMount
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            initialFocus
            fromDate={new Date()}
            disabled={(date) => date < new Date()}
            className="rounded-md border-0"
            classNames={{
              months: "space-y-4",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-75 hover:opacity-100",
                "hover:bg-gray-100 rounded-md transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              ),
              day: cn(
                "h-9 w-9 p-0 font-normal",
                "hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary/90"
              ),
              day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
              day_hidden: "invisible"
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};