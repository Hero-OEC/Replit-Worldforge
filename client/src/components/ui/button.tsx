import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)] dark:bg-[var(--color-600)] dark:text-[var(--color-50)] dark:hover:bg-[var(--color-700)]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700",
        outline:
          "border border-[var(--color-300)] bg-transparent text-[var(--color-700)] hover:bg-[var(--color-100)] hover:text-[var(--color-900)] dark:border-[var(--color-600)] dark:text-[var(--color-300)] dark:hover:bg-[var(--color-800)] dark:hover:text-[var(--color-100)]",
        secondary:
          "bg-[var(--color-200)] text-[var(--color-700)] hover:bg-[var(--color-300)] dark:bg-[var(--color-700)] dark:text-[var(--color-200)] dark:hover:bg-[var(--color-600)]",
        ghost: "hover:bg-[var(--color-100)] hover:text-[var(--color-900)] dark:hover:bg-[var(--color-800)] dark:hover:text-[var(--color-100)]",
        link: "text-[var(--color-600)] underline-offset-4 hover:underline dark:text-[var(--color-400)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
