import type { VariantProps } from "class-variance-authority";

import { cva } from "class-variance-authority";
import { HexagonIcon } from "lucide-react";

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

const logoVariants = cva("flex items-center gap-1 font-semibold", {
  variants: {
    size: {
      xs: "text-xs [&_svg]:h-3 [&_svg]:w-3",
      sm: "text-sm [&_svg]:h-4 [&_svg]:w-4",
      default: "text-base [&_svg]:h-5 [&_svg]:w-5",
      lg: "text-lg [&_svg]:h-6 [&_svg]:w-6",
      xl: "text-xl [&_svg]:h-7 [&_svg]:w-7",
      "2xl": "text-2xl [&_svg]:h-8 [&_svg]:w-8",
      "3xl": "text-3xl [&_svg]:h-10 [&_svg]:w-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string;
}

export function Logo({ size, className }: LogoProps) {
  return (
    <a href="/">
      <div className={cn(logoVariants({ size }), className)}>
        <HexagonIcon />
        <span className="font-black uppercase">Snapit</span>
      </div>
    </a>
  );
}
