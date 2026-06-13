import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OnlineBadgeProps {
  avatarUrl?: string;
  name?: string;
  description?: string;
  isOnline: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export const OnlineBadge: React.FC<OnlineBadgeProps> = ({
  avatarUrl,
  name = "",
  description = "",
  isOnline,
  size = "md",
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-flex shrink-0">
        <Avatar className={sizeMap[size]}>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        {isOnline && (
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
        )}
      </div>

      {(name || description) && (
        <div className="min-w-0">
          {name && (
            <p className="text-sm font-medium leading-none truncate">{name}</p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineBadge;