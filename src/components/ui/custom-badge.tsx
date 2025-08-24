import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Green
        green: "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40",
        "green-dot": "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40",
        "green-bordered": "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40",
        "green-dot-bordered": "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40",
        
        // Red  
        red: "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40",
        "red-dot": "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40",
        "red-bordered": "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40",
        "red-dot-bordered": "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40",
        
        // Yellow/Amber
        yellow: "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40",
        "yellow-dot": "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40",
        "yellow-bordered": "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40",
        "yellow-dot-bordered": "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40",
        
        // Blue
        blue: "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40",
        "blue-dot": "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40",
        "blue-bordered": "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40",
        "blue-dot-bordered": "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40",
        
        // Gray
        gray: "bg-muted text-muted-foreground hover:bg-muted/80",
        "gray-dot": "bg-muted text-muted-foreground hover:bg-muted/80",
        "gray-bordered": "border border-border bg-muted text-muted-foreground hover:bg-muted/80",
        "gray-dot-bordered": "border border-border bg-muted text-muted-foreground hover:bg-muted/80",
        
        // Purple
        purple: "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40",
        "purple-dot": "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40",
        "purple-bordered": "border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40",
        "purple-dot-bordered": "border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40",
        
        // Pink
        pink: "bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-900/40",
        "pink-dot": "bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-900/40",
        "pink-bordered": "border border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100 dark:border-pink-700 dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-900/40",
        "pink-dot-bordered": "border border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100 dark:border-pink-700 dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-900/40",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  }
)

export interface CustomBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean
}

function CustomBadge({ className, variant, showDot, children, ...props }: CustomBadgeProps) {
  const isDotVariant = variant?.includes("-dot")
  const shouldShowDot = showDot || isDotVariant

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {shouldShowDot && (
        <div 
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant?.includes("green") && "bg-green-500 dark:bg-green-400",
            variant?.includes("red") && "bg-red-500 dark:bg-red-400", 
            variant?.includes("yellow") && "bg-amber-500 dark:bg-amber-400",
            variant?.includes("blue") && "bg-blue-500 dark:bg-blue-400",
            variant?.includes("gray") && "bg-gray-500 dark:bg-gray-400",
            variant?.includes("purple") && "bg-purple-500 dark:bg-purple-400",
            variant?.includes("pink") && "bg-pink-500 dark:bg-pink-400",
          )}
        />
      )}
      {children}
    </div>
  )
}

export { CustomBadge, badgeVariants }