"use client";

import { FC, useId } from "react";
import { useTheme } from "@wrksz/themes/client";

import { cn } from "@/lib/utils";

import { SunFilledIcon, MoonFilledIcon } from "./icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const inputId = useId();

  const isLight = resolvedTheme === "light";

  const toggle = () => setTheme(isLight ? "dark" : "light");

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "px-px transition-opacity hover:opacity-80 cursor-pointer",
        "flex items-center justify-center",
        className
      )}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={isLight}
        onChange={toggle}
        className="sr-only"
      />
      <div className="w-auto h-auto bg-transparent rounded-lg flex items-center justify-center text-muted-foreground pt-px">
        {isLight ? <SunFilledIcon size={22} /> : <MoonFilledIcon size={22} />}
      </div>
    </label>
  );
};