import { useTheme } from "@wrksz/themes/client";
import { Sun, Moon } from "lucide-react";

const ThemeTab = ({
  theme,
  resolvedTheme,
  setTheme,
  icon,
}: {
  theme: "light" | "dark";
  resolvedTheme: string | undefined;
  setTheme: (t: "light" | "dark") => void;
  icon: React.ReactNode;
}) => {
  const isActive = resolvedTheme === theme;
  return (
    <button
      onClick={() => setTheme(theme)}
      className={`flex items-center justify-center w-7 h-7 rounded-md transition-all duration-150 ${
        isActive
          ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
          : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
      }`}
    >
      {icon}
    </button>
  );
};

export default ThemeTab;