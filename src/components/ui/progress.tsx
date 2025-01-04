import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // Calculate the gradient color based on progress value
  const getProgressColor = (value: number = 0) => {
    if (value <= 50) {
      // Transition from red to mint green for 0-50%
      return `linear-gradient(90deg, #EF4444 0%, #34D399 ${value * 2}%)`
    } else {
      // Transition from mint green to dark green for 50-100%
      return `linear-gradient(90deg, #34D399 ${(value - 50) * 2}%, #107A57 100%)`
    }
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 transition-all duration-300"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: getProgressColor(value),
        }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }