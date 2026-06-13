"use client";
import * as React from "react";

// ============================================================================
// Hook Implementation
// ============================================================================

interface UseMediaQueryOptions {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
}

const IS_SERVER = typeof window === "undefined";

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {},
): boolean {
  const [mounted, setMounted] = React.useState(false);

  const getMatches = (query: string): boolean => {
    if (IS_SERVER) return defaultValue;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = React.useState<boolean>(() => {
    if (initializeWithValue) return getMatches(query);
    return defaultValue;
  });

  React.useEffect(() => {
    setMounted(true);
    const matchMedia = window.matchMedia(query);
    const handleChange = () => setMatches(matchMedia.matches);

    handleChange();
    matchMedia.addEventListener("change", handleChange);
    return () => matchMedia.removeEventListener("change", handleChange);
  }, [query]);

  return mounted ? matches : defaultValue;  
}

export type { UseMediaQueryOptions };
