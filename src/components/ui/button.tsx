import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-bold transition-all duration-150 disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-[18px] [&_svg]:shrink-0 active:translate-y-[2px]",
  {
    variants: {
      variant: {
        primary:
          "border-2 border-b-[4px] border-brand-dark bg-brand text-white hover:bg-[#C2333F] active:border-b-2",
        accent:
          "border-2 border-b-[4px] border-accent-dark bg-accent text-white hover:bg-[#FF9D5E] active:border-b-2",
        success:
          "border-2 border-b-[4px] border-success-dark bg-success text-white hover:brightness-105 active:border-b-2",
        danger:
          "border-2 border-b-[4px] border-danger-dark bg-danger text-white hover:brightness-105 active:border-b-2",
        outline:
          "border-2 border-b-[4px] border-line-strong bg-white text-ink hover:border-brand-tint hover:bg-brand-soft/40 active:border-b-2",
        ghost: "text-ink-soft hover:bg-ink/5 hover:text-ink",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-[15px]",
        lg: "h-13 px-7 text-base py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
