import * as React from "react";
import { cn } from "../lib/Utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-medium text-gray-700 dark:text-gray-300",
          className
        )}
        {...props}
      >
        {children}
      </label>
    );
  }
);
Label.displayName = "Label";

export { Label };
