"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, Loader2 } from "lucide-react";
import {
  usePollByPostId,
  useUnvotePoll,
  useVotePoll,
} from "../hooks/usePoll";
import { PollItem } from "@/components/ui/PollItem";
import { PollFormatted } from "../types/poll.types";

function pluralVotes(n: number) {
  if (n === 1) return "голос";
  if (n >= 2 && n <= 4) return "голоса";
  return "голосов";
}

interface PollCardProps {
  postId: string;
  poll: PollFormatted | undefined;
}

export function PollCard({ postId, poll }: PollCardProps) {
  console.log("poll from poll card", poll);
  const { mutate: vote, isPending: isVoting } = useVotePoll(
    poll?.id ?? "",
    postId,
  );
  const { mutate: unvote, isPending: isUnvoting } = useUnvotePoll(
    poll?.id ?? "",
    postId,
  );

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center py-4">
  //       <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
  //     </div>
  //   );
  // }

  if (!poll) return null;

  const hasVoted = poll.userVotedOptionIds.length > 0;
  const phase = poll.isExpired || hasVoted ? "result" : "vote";
  const maxVotes = Math.max(...poll.options.map((o) => o.votes), 1);
  const isBusy = isVoting || isUnvoting;

  const handleVote = (optionId: string) => {
    if (poll.isMultiple) return; // множественный — отдельная кнопка
    vote({ optionIds: [optionId] });
  };

  return (
    <div
      className="mt-3 space-y-2 border rounded-lg p-3 bg-white dark:bg-[#101010] "
      onClick={(e) => e.stopPropagation()} // не открываем пост при клике
    >
      <span className="flex gap-2">
        <BarChart3 className="w-5 h-5" />
        <p className="text-sm font-medium">{poll.question}</p>
      </span>
      <div className="space-y-2">
        {poll.options.map((opt) => (
          <PollItem
            key={opt.id}
            option={opt}
            phase={phase}
            isChosen={poll.userVotedOptionIds.includes(opt.id)}
            isWinner={
              phase === "result" &&
              opt.votes === maxVotes &&
              poll.totalVotes > 0
            }
            onVote={handleVote}
            disabled={isBusy}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">
          {poll.totalVotes} {pluralVotes(poll.totalVotes)}
          {poll.isExpired && " · Опрос завершён"}
        </span>

        {hasVoted && !poll.isExpired && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => unvote()}
            disabled={isBusy}
          >
            {isUnvoting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              "Отменить голос"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
