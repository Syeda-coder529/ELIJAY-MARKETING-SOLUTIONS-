import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary CTA: metallic gold on midnight black, per brand handoff.
        default:
          "bg-gold-gradient text-background hover:brightness-105 hover:scale-[1.02]",
        outline:
          "border border-gold/40 bg-transparent text-gold hover:border-gold hover:bg-gold/10",
        emerald:
          "bg-emerald text-foreground border border-emerald-teal/30 hover:border-emerald-teal/60",
        ghost: "text-foreground hover:bg-white/5",
        subtle:
          "border border-border bg-panel text-foreground hover:border-gold/40 hover:text-gold",
        danger:
          "border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
      /** Retained as a no-op so call sites keep compiling; the white sweep
       *  was removed because it washed over the metallic gold. */
      shimmer: { true: "", false: "" },
    },
    defaultVariants: { variant: "default", size: "default", shimmer: false },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shimmer, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shimmer, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
