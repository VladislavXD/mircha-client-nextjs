"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PollOptionFormatted } from "@/src/features/post/components/Poll/types/poll.types";


interface PollItemProps {
  option: PollOptionFormatted;
  phase: "vote" | "result";
  isChosen: boolean;
  isWinner: boolean;
  onVote: (id: string) => void;
  disabled?: boolean;
}

function ResultBar({ pct, isChosen }: { pct: number; isChosen: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    barRef.current.style.width = "0%";
    void barRef.current.offsetWidth;
    barRef.current.style.width = `${pct}%`;
  }, [pct]);

  return (
    <div
      ref={barRef}
      className={`absolute inset-y-0 left-0 rounded-md pointer-events-none
        ${isChosen ? "bg-primary/25" : "bg-muted"}`}
      style={{ transition: "width 1000ms ease-in-out" }}
    />
  );
}

export function PollItem({ option, phase, isChosen, isWinner, onVote, disabled }: PollItemProps) {
  return (
    <div className="relative">
      <Button
        onClick={() => onVote(option.id)}
        disabled={phase === "result" || disabled}
        variant={isChosen ? "default" : "outline"}
        className="w-full justify-between h-auto py-2.5 px-3 text-left font-normal relative overflow-hidden "
      >
        {phase === "result" && <ResultBar pct={option.percent} isChosen={isChosen} />}

        <span className="relative z-10">{option.text}</span>

        {phase === "result" && (
          <div className="relative z-10 flex items-center gap-2 shrink-0 ml-4">
            
            <span className="tabular-nums text-xs font-semibold text-muted-foreground">
              {option.percent}%
            </span>
          </div>
        )}
      </Button>
    </div>
  );
}