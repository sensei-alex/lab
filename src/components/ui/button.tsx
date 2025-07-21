import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex items-center justify-center transition-all outline-none rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-ctp-surface0",
        safe: "bg-ctp-teal text-ctp-base",
        destructive: "bg-ctp-red text-ctp-base",
        accent: "bg-ctp-lavender text-ctp-base",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Button({
  className,
  variant,
  icon,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    icon: React.FC;
  }) {
  const text = props.children ? (
    <span className="p-4 h-14">{props.children}</span>
  ) : (
    <></>
  );
  const Icon = icon;

  return (
    <button
      data-slot="button"
      className={
        "flex items-center justify-center transition-all border-2 bg-ctp-mantle outline-none rounded-lg hover:scale-95 border-ctp-crust hover:cursor-pointer"
      }
      {...props}
    >
      {text}
      <div
        className={cn(buttonVariants({ variant, className })) + " h-14 w-14"}
      >
        <Icon />
      </div>
    </button>
  );
}

export { Button, buttonVariants };
