

import { api } from "@/src/api";
import { VoteDto, CreatePollDto, PollFormatted } from "../types/poll.types";

/**
 * API сервис для работы с опросами.
 *
 * Использует axios через базовый api сервис.
 */
class PollService {
  /**
   * Создание опроса для поста.
   *
   * @param postId - ID поста
   * @param dto - Вопрос, варианты, флаг множественного выбора и дата окончания
   * @returns Созданный опрос с процентами
   */
  async createPoll(postId: string, dto: CreatePollDto): Promise<PollFormatted> {
    return api.post<PollFormatted>(`polls/${postId}`, dto);
  }

  /**
   * Получение опроса по postId.
   *
   * @param postId - ID поста
   * @returns Опрос с вариантами, процентами и голосом текущего пользователя
   */
  async getPollByPostId(postId: string): Promise<PollFormatted> {
    return api.get<PollFormatted>(`polls/post/${postId}`);
  }

  /**
   * Голосование в опросе.
   *
   * @param pollId - ID опроса
   * @param dto - Массив ID выбранных вариантов
   * @returns Обновлённый опрос с актуальными процентами
   */
  async vote(pollId: string, dto: VoteDto): Promise<PollFormatted> {
    return api.post<PollFormatted>(`polls/${pollId}/vote`, dto);
  }

  /**
   * Отмена голоса в опросе.
   *
   * @param pollId - ID опроса
   * @returns Обновлённый опрос без голоса пользователя
   */
  async unvote(pollId: string): Promise<PollFormatted> {
    return api.delete<PollFormatted>(`polls/${pollId}/vote`);
  }

  /**
   * Удаление опроса.
   *
   * @param pollId - ID опроса
   * @returns Флаг успешного удаления
   */
  async deletePoll(pollId: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`polls/${pollId}`);
  }
}

export const pollService = new PollService();