import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm",
  {
    variants: {
      variant: {
        // Primary importance - darkest color for most important items
        primary: "bg-[var(--color-500)] border-[var(--color-600)] text-[var(--color-50)] hover:bg-[var(--color-400)]",
        
        // High importance
        high: "bg-[var(--color-400)] border-[var(--color-500)] text-[var(--color-950)] hover:bg-[var(--color-300)]",
        
        // Medium importance
        medium: "bg-[var(--color-300)] border-[var(--color-400)] text-[var(--color-900)] hover:bg-[var(--color-200)]",
        
        // Secondary/low importance
        secondary: "bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]",
        low: "bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]",
        
        // Default/neutral
        default: "bg-[var(--color-100)] border-[var(--color-200)] text-[var(--color-700)] hover:bg-[var(--color-200)]",
        
        // Muted/least important
        muted: "bg-[var(--color-50)] border-[var(--color-100)] text-[var(--color-600)] hover:bg-[var(--color-100)]",
        
        // Character roles mapped to importance levels
        protagonist: "bg-[var(--color-500)] border-[var(--color-600)] text-[var(--color-50)] hover:bg-[var(--color-400)]",
        antagonist: "bg-[var(--color-400)] border-[var(--color-500)] text-[var(--color-950)] hover:bg-[var(--color-300)]",
        ally: "bg-[var(--color-300)] border-[var(--color-400)] text-[var(--color-900)] hover:bg-[var(--color-200)]",
        enemy: "bg-[var(--color-300)] border-[var(--color-400)] text-[var(--color-900)] hover:bg-[var(--color-200)]",
        supporting: "bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]",
        neutral: "bg-[var(--color-100)] border-[var(--color-200)] text-[var(--color-700)] hover:bg-[var(--color-200)]",
        
        // All other categories use the same simplified mapping
        location: "bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]",
        magic: "bg-[var(--color-300)] border-[var(--color-400)] text-[var(--color-900)] hover:bg-[var(--color-200)]",
        power: "bg-[var(--color-300)] border-[var(--color-400)] text-[var(--color-900)] hover:bg-[var(--color-200)]",
        character_arc: "bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]",
        discovery: "bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]",
        conflict: "bg-[var(--color-300)] border-[var(--color-400)] text-[var(--color-900)] hover:bg-[var(--color-200)]",
        revelation: "bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]",
        heroic_act: "bg-[var(--color-300)] border-[var(--color-400)] text-[var(--color-900)] hover:bg-[var(--color-200)]",
        political_event: "bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]",
        romance: "bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]",
        mystery: "bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]",
        battle: "bg-[var(--color-300)] border-[var(--color-400)] text-[var(--color-900)] hover:bg-[var(--color-200)]",
        traveling: "bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  onRemove?: () => void
  removable?: boolean
}

function Tag({ className, variant, size, onRemove, removable, children, ...props }: TagProps) {
  return (
    <span className={cn(tagVariants({ variant, size }), className)} {...props}>
      {children}
      {(removable || onRemove) && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}

// Helper function to get variant based on type
export function getTagVariant(type: string, category?: string): TagProps["variant"] {
  // Character roles
  if (type === "Protagonist") return "protagonist"
  if (type === "Antagonist") return "antagonist"
  if (type === "Ally") return "ally"
  if (type === "Enemy") return "enemy"
  if (type === "Supporting") return "supporting"
  if (type === "Neutral") return "neutral"
  
  // Importance levels
  if (type === "high") return "high"
  if (type === "medium") return "medium"
  if (type === "low") return "low"
  
  // Magic system categories
  if (type === "magic") return "magic"
  if (type === "power") return "power"
  
  // Event categories
  if (category === "Character Arc") return "character_arc"
  if (category === "Discovery") return "discovery"
  if (category === "Conflict") return "conflict"
  if (category === "Revelation") return "revelation"
  if (category === "Heroic Act") return "heroic_act"
  if (category === "Political Event") return "political_event"
  if (category === "Romance") return "romance"
  if (category === "Mystery") return "mystery"
  if (category === "Magic") return "magic"
  if (category === "Battle") return "battle"
  if (category === "Traveling") return "traveling"
  
  // Location type
  if (type === "location") return "location"
  
  return "default"
}

export { Tag, tagVariants }