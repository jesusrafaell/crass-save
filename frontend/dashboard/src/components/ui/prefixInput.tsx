import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PrefixInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex items-center gap-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
      >
        <div className="opacity-50">{prefix}</div>
        <input type={type} className="w-full outline-none" {...props} />
      </div>
    );
  }
);
PrefixInput.displayName = "Input";

export { PrefixInput };
