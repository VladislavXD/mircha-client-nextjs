import { useState, useCallback } from "react";

/**
 * Hook для управления упоминаниями (@mentions)
 */
export const useMentions = () => {
  const [mention, setMention] = useState<string>("");
  const [showHit, setShowHit] = useState<boolean>(false);
  const [atStartIndex, setAtStartIndex] = useState<number | null>(null);

  const detectMention = useCallback((text: string) => {
    const atIndex = text.lastIndexOf("@");
    if (atIndex !== -1) {
      const query = text.slice(atIndex + 1);
      if (!query || query.includes(" ") || query.includes("@")) {
        setShowHit(false);
      } else {
        setMention(query);
        setShowHit(true);
        setAtStartIndex(atIndex);
      }
    } else {
      setShowHit(false);
    }
  }, []);

  const resetMention = useCallback(() => {
    setShowHit(false);
    setMention("");
    setAtStartIndex(null);
  }, []);

  return {
    mention,
    showHit,
    atStartIndex,
    setMention,
    setShowHit,
    setAtStartIndex,
    detectMention,
    resetMention,
  };
};
