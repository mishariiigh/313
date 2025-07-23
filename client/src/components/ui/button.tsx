import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-arabic",
  {
    variants: {
      variant: {
        default: "arabic-button text-primary-foreground hover:scale-105 shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
        outline:
          "border-2 border-arabic-sage bg-background hover:bg-arabic-sage hover:text-white shadow-sm hover:shadow-lg",
        secondary:
          "arabic-accent text-foreground hover:scale-105 shadow-md",
        ghost: "hover:bg-arabic-cream hover:text-arabic-sage-dark",
        link: "text-arabic-sage underline-offset-4 hover:underline arabic-text-gradient",
        elegant: "bg-gradient-to-r from-arabic-sage to-arabic-sage-light text-white hover:from-arabic-sage-dark hover:to-arabic-sage shadow-xl hover:shadow-2xl hover:scale-105",
        golden: "bg-gradient-to-r from-arabic-gold to-arabic-terracotta text-foreground hover:from-arabic-terracotta hover:to-arabic-gold shadow-lg hover:shadow-xl hover:scale-105",
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
