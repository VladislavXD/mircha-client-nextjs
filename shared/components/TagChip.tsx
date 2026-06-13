"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TagChipData = {
  id?: string;
  name: string;
  slug?: string;
  icon?: string | null;
  color?: string | null;
};

type Size = "sm" | "md" | "lg";
type Variant = "flat" | "bordered" | "solid";

export interface TagChipProps {
  tag: TagChipData;
  size?: Size;
  variant?: Variant;
  className?: string;
  withColorBackground?: boolean;
  asLink?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-1.5 py-0",
  md: "text-sm px-2 py-0.5",
  lg: "text-base px-2.5 py-1",
};

const variantMap: Record<Variant, "default" | "outline" | "secondary"> = {
  flat: "secondary",
  bordered: "outline",
  solid: "default",
};

/**
 * Единый чип для тега: показывает иконку (URL/эмодзи) и имя, опционально подкрашивает фон по цвету тега.
 */
export default function TagChip({
  tag,
  size = "sm",
  variant = "flat",
  className,
  withColorBackground = true,
  asLink = false,
  href,
  onClick,
}: TagChipProps) {
  const icon = tag.icon || undefined;
  const isUrl = !!icon && /^(https?:)?\/\//.test(icon);

  const style: React.CSSProperties = {};

  if (withColorBackground && tag.color) {
    style.backgroundColor = tag.color;
  }

  const content = (
    <Badge
      className={cn("items-center gap-1 cursor-default", sizeClasses[size], className)}
      style={style}
      variant={variantMap[variant]}
      onClick={onClick}
    >
      {icon ? (
        isUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="w-4 h-4 object-cover rounded" src={icon} />
        ) : (
          <span>{icon}</span>
        )
      ) : null}
      <span>{tag.name}</span>
    </Badge>
  );

  if (asLink && href) {
    return (
      <a className="flex" href={href} onClick={onClick}>
        {content}
      </a>
    );
  }

  return content;
}