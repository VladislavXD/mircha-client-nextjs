/**
 * Типы для опросов (Polls)
 *
 * @module features/post/types/poll
 */

// ─── DTO ──────────────────────────────────────────────────────────────────────

export interface CreatePollDto {
  question: string;
  options: string[];
  isMultiple?: boolean;
  expiresAt?: string | null;
}

export interface VoteDto {
  optionIds: string[];
}

// ─── Ответы сервера ───────────────────────────────────────────────────────────

/**
 * Вариант опроса с вычисленными полями (приходит из formatPoll на бэке)
 */
export interface PollOptionFormatted {
  id: string;
  text: string;
  order: number;
  votes: number;
  percent: number;
}

/**
 * Полный опрос с вычисленными полями (приходит из formatPoll на бэке)
 */
export interface PollFormatted {
  id: string;
  question: string;
  isMultiple: boolean;
  expiresAt: string | null;
  isExpired: boolean;
  totalVotes: number;
  options: PollOptionFormatted[];
  /** ID вариантов, за которые проголосовал текущий пользователь */
  userVotedOptionIds: string[];
}