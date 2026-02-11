"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Snowflake } from "lucide-react";

/**
 * Кнопка переключения снегопада с сохранением в localStorage
 */
export default function SnowToggle({
  onToggle,
}: {
  onToggle: (enabled: boolean) => void;
}) {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Читаем из localStorage при монтировании
    const saved = localStorage.getItem("snowfall-enabled");
    const isEnabled = saved === null ? true : saved === "true";
    setEnabled(isEnabled);
    onToggle(isEnabled);
  }, []);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    localStorage.setItem("snowfall-enabled", String(newValue));
    onToggle(newValue);
  };

  if (!mounted) return null;

  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      aria-label="Переключить снегопад"
      onPress={handleToggle}
      className={`transition-all ${enabled ? "text-blue-400" : "text-gray-400"}`}
    >
      <Snowflake
        className={`transition-transform ${enabled ? "animate-spin-slow" : ""}`}
        size={20}
      />
    </Button>
  );
}
