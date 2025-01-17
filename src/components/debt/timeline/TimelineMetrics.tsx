import { format } from "date-fns";

interface TimelineMetricsProps {
  baselineMonths: number;
  acceleratedMonths: number;
  monthsSaved: number;
  baselineLatestDate: Date;
}

export const TimelineMetrics = ({ 
  baselineMonths, 
  acceleratedMonths, 
  monthsSaved,
  baselineLatestDate 
}: TimelineMetricsProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
          <p className="text-2xl font-bold text-emerald-600">
            {monthsSaved} months
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Original Term</p>
          <p className="text-2xl font-bold">
            {baselineMonths} months
          </p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {monthsSaved > 0 && (
          <span className="text-emerald-600">
            You'll be debt-free {monthsSaved} months sooner!
          </span>
        )}
      </div>
    </div>
  );
};