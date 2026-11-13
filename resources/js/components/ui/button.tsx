import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-ink text-ivory hover:bg-ink/85",
        accent: "bg-bronze text-ink hover:bg-[#dcc08e]",
        destructive: "bg-danger text-ivory hover:bg-danger/90",
        outline: "border border-ink bg-transparent text-ink hover:bg-ink hover:text-ivory",
        secondary: "border border-hairline bg-paper text-ink hover:border-ink",
        ghost: "text-ink hover:bg-sand",
        link: "text-ink underline underline-offset-4 decoration-hairline hover:decoration-ink",
      },
      size: {
        default: "h-11 px-5 has-[>svg]:px-4",
        sm: "h-9 px-3.5 has-[>svg]:px-3",
        lg: "h-12 px-7 text-base has-[>svg]:px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
