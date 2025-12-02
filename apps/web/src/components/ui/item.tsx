import type { VariantProps } from "class-variance-authority";
import type React from "react";

import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { cva } from "class-variance-authority";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function ItemGroup({
  className,
  render,
  ...props
}: React.ComponentProps<"ul"> & { render?: useRender.RenderProp }) {
  const defaultProps = {
    "data-slot": "item-group",
    className: cn("group/item-group flex flex-col", className),
  };

  return useRender({
    defaultTagName: "ul",
    render,
    props: mergeProps<"ul">(defaultProps, props),
  });
}

function ItemSeparator({
  className,
  render,
  ...props
}: React.ComponentProps<typeof Separator> & { render?: useRender.RenderProp }) {
  const defaultProps = {
    "data-slot": "item-separator",
    className: cn("my-0", className),
    orientation: "horizontal" as const,
  };

  return useRender({
    defaultTagName: "div",
    render:
      render ||
      ((innerProps) => (
        <Separator
          {...(innerProps as React.ComponentProps<typeof Separator>)}
        />
      )),
    props: mergeProps(defaultProps, props),
  });
}

const itemVariants = cva(
  "group/item relative flex flex-wrap items-center rounded-md border border-transparent bg-clip-padding text-sm outline-none transition-colors duration-100 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background [a]:transition-colors [a]:hover:bg-accent/50",
  {
    variants: {
      variant: {
        default:
          "not-disabled:inset-shadow-[0_1px_--theme(--color-white/10%)] bg-background not-disabled:shadow-sm not-disabled:before:shadow-black/10 not-disabled:before:shadow-sm hover:bg-accent/40 active:inset-shadow-[0_1px_--theme(--color-black/10%)] active:before:shadow-xs dark:shadow-black/24 dark:before:hidden",
        outline:
          "border-border bg-background not-disabled:before:shadow-sm hover:bg-accent/30 active:before:shadow-xs dark:bg-input/32 dark:not-disabled:shadow-sm dark:shadow-black/24 dark:active:shadow-none dark:before:shadow-[0_-1px_--theme(--color-white/8%)]",
        muted: "border-border bg-muted/50",
      },
      size: {
        default: "gap-4 p-4",
        sm: "gap-2.5 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ItemProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof itemVariants> {
  render?: useRender.RenderProp;
}

function Item({ className, variant, size, render, ...props }: ItemProps) {
  const defaultProps = {
    "data-slot": "item",
    "data-variant": variant,
    "data-size": size,
    className: cn(itemVariants({ variant, size, className })),
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-8 rounded-sm border bg-muted [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ItemMediaProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof itemMediaVariants> {
  render?: useRender.RenderProp;
}

function ItemMedia({ className, variant, render, ...props }: ItemMediaProps) {
  const defaultProps = {
    "data-slot": "item-media",
    "data-variant": variant,
    className: cn(itemMediaVariants({ variant, className })),
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

function ItemContent({
  className,
  render,
  ...props
}: React.ComponentProps<"div"> & { render?: useRender.RenderProp }) {
  const defaultProps = {
    "data-slot": "item-content",
    className: cn(
      "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
      className
    ),
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

function ItemTitle({
  className,
  render,
  ...props
}: React.ComponentProps<"div"> & { render?: useRender.RenderProp }) {
  const defaultProps = {
    "data-slot": "item-title",
    className: cn(
      "flex w-fit items-center gap-2 font-medium text-sm leading-snug",
      className
    ),
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

function ItemDescription({
  className,
  render,
  ...props
}: React.ComponentProps<"p"> & { render?: useRender.RenderProp }) {
  const defaultProps = {
    "data-slot": "item-description",
    className: cn(
      "line-clamp-2 text-balance font-normal text-muted-foreground text-sm leading-normal",
      "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
      className
    ),
  };

  return useRender({
    defaultTagName: "p",
    render,
    props: mergeProps<"p">(defaultProps, props),
  });
}

function ItemActions({
  className,
  render,
  ...props
}: React.ComponentProps<"div"> & { render?: useRender.RenderProp }) {
  const defaultProps = {
    "data-slot": "item-actions",
    className: cn("flex items-center gap-2", className),
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

function ItemHeader({
  className,
  render,
  ...props
}: React.ComponentProps<"div"> & { render?: useRender.RenderProp }) {
  const defaultProps = {
    "data-slot": "item-header",
    className: cn(
      "flex basis-full items-center justify-between gap-2",
      className
    ),
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

function ItemFooter({
  className,
  render,
  ...props
}: React.ComponentProps<"div"> & { render?: useRender.RenderProp }) {
  const defaultProps = {
    "data-slot": "item-footer",
    className: cn(
      "flex basis-full items-center justify-between gap-2",
      className
    ),
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
};
