import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 border border-hairline bg-white px-3.5 py-2 text-base text-ink transition-colors outline-none selection:bg-ink selection:text-ivory placeholder:text-muted-stone file:mr-3 file:inline-flex file:h-full file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-bronze-deep focus-visible:ring-2 focus-visible:ring-bronze/40",
        "aria-invalid:border-danger",
        className
      )}
      {...props}
    />
  )
}

export { Input }
