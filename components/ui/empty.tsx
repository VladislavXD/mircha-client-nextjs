import * as React from "react";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Empty({ className, children, ...props }: EmptyProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-neutral-200 dark:border-neutral-800/70 bg-white dark:bg-[#101010] p-8 text-center animate-in fade-in-50 duration-500",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

interface EmptyIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
}

export function EmptyIcon({ className, icon: Icon, ...props }: EmptyIconProps) {
  return (
    <div
      className={cn(
        "flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-[#1a1a1a] shadow-sm mb-4",
        className,
      )}
      {...props}
    >
      <Icon
        className="h-10 w-10 text-neutral-400 dark:text-neutral-500"
        strokeWidth={1.5}
      />
    </div>
  );
}

interface EmptyTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function EmptyTitle({ className, ...props }: EmptyTitleProps) {
  return (
    <h2
      className={cn(
        "mt-2 text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100",
        className,
      )}
      {...props}
    />
  );
}

interface EmptyDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function EmptyDescription({
  className,
  ...props
}: EmptyDescriptionProps) {
  return (
    <p
      className={cn(
        "mb-4 mt-2 text-center text-sm font-normal leading-6 text-neutral-500 dark:text-neutral-400",
        className,
      )}
      {...props}
    />
  );
}
