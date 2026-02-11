"use client";

import React from "react";
import { Chip } from "@heroui/react";

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
    style.backgroundColor = tag.color || undefined;
  }

  const content = (
    <Chip
      size={size}
      variant={variant}
      className={`items-center gap-1 text-xs flex   ${className || ""}`}
      style={style}
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        {icon ? (
          isUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={icon} alt="" className="w-4 h-4 object-cover rounded" />
          ) : (
            <span>{icon}</span>
          )
        ) : null}
        <span>{tag.name}</span>
      </div>
    </Chip>
  );

  if (asLink && href) {
    // Оборачиваем в ссылку, но оставляем вид Chip
    return (
      <a href={href} onClick={onClick} className=" flex">
        {content}
      </a>
    );
  }

  return content;
}
