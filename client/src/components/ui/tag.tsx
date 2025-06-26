import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm",
  {
    variants: {
      variant: {
        // Character types
        protagonist: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800 hover:bg-yellow-100",
        antagonist: "bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-800 hover:bg-red-100",
        ally: "bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-800 hover:bg-green-100",
        enemy: "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 text-orange-800 hover:bg-orange-100",
        supporting: "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-800 hover:bg-blue-100",
        neutral: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-800 hover:bg-gray-100",
        
        // Location types
        location: "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 text-purple-800 hover:bg-purple-100",
        
        // Timeline event types
        high: "bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-800 hover:bg-red-100",
        medium: "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 text-orange-800 hover:bg-orange-100",
        low: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800 hover:bg-yellow-100",
        
        // Magic system types
        magic: "bg-gradient-to-r from-violet-50 to-violet-100 border-violet-200 text-violet-800 hover:bg-violet-100",
        power: "bg-gradient-to-r from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-800 hover:bg-cyan-100",
        
        // Event categories
        character_development: "bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-800 hover:bg-indigo-100",
        discovery: "bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200 text-teal-800 hover:bg-teal-100",
        conflict: "bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-800 hover:bg-red-100",
        revelation: "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-800 hover:bg-amber-100",
        heroic_act: "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800 hover:bg-emerald-100",
        political_event: "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 text-slate-800 hover:bg-slate-100",
        romance: "bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200 text-pink-800 hover:bg-pink-100",
        mystery: "bg-gradient-to-r from-stone-50 to-stone-100 border-stone-200 text-stone-800 hover:bg-stone-100",
        battle: "bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200 text-rose-800 hover:bg-rose-100",
        traveling: "bg-gradient-to-r from-sky-50 to-sky-100 border-sky-200 text-sky-800 hover:bg-sky-100",
        
        // Generic/default
        default: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-800 hover:bg-gray-100",
        primary: "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 text-orange-800 hover:bg-orange-100",
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
  if (category === "Character Development") return "character_development"
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