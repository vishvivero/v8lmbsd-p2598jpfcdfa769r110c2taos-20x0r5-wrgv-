import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="relative space-y-2">
      <Label className="text-sm font-medium text-gray-700">Next Payment Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              "bg-white hover:bg-gray-50/80",
              "border border-gray-200 hover:border-primary/50",
              "shadow-sm transition-all duration-200",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
            {date ? format(date, "PPP") : <span>Select payment date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-4 bg-white rounded-xl shadow-lg border-0"
          align="start"
          sideOffset={4}
          forceMount
        >
          <div 
            className="rounded-lg overflow-hidden bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={onSelect}
              fromDate={new Date()}
              disabled={(date) => date < new Date()}
              initialFocus
              classNames={{
                months: "space-y-4",
                month: "space-y-4",
                caption: "flex justify-center pt-2 relative items-center bg-primary/5 pb-2",
                caption_label: "text-sm font-semibold text-primary",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                  "h-8 w-8 bg-transparent p-0 opacity-85 hover:opacity-100",
                  "hover:bg-primary/10 rounded-lg transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "text-primary"
                ),
                nav_button_previous: "absolute left-2",
                nav_button_next: "absolute right-2",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-primary/70 rounded-md w-10 font-medium text-[0.875rem] p-0",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                day: cn(
                  "h-9 w-9 p-0 font-normal",
                  "hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary/90",
                  "cursor-pointer select-none"
                ),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
                day_today: "bg-primary/5 text-primary font-semibold ring-1 ring-primary/20",
                day_outside: "text-gray-400 opacity-50 hover:bg-transparent",
                day_disabled: "text-gray-400 opacity-50 cursor-not-allowed hover:bg-transparent",
                day_hidden: "invisible",
                day_range_middle: "rounded-none",
                day_range_end: "rounded-r-lg",
                day_range_start: "rounded-l-lg"
              }}
              components={{
                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />,
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};