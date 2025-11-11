import { viewsCache, viewsRateLimiter } from './viewsOptimizations';

// Менеджер для группировки и отложенной отправки просмотров
class ViewsManager {
  private viewsQueue: Set<string> = new Set();
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY = 2000; // 2 секунды
  private readonly MAX_BATCH_SIZE = 10; // Максимум 10 просмотров за раз
  private addViewCallback: ((postIds: string[]) => Promise<void>) | null = null;

  constructor() {
    // Привязываем контекст
    this.addView = this.addView.bind(this);
    this.processBatch = this.processBatch.bind(this);
  }

  // Устанавливаем callback для отправки батча
  setAddViewCallback(callback: (postIds: string[]) => Promise<void>) {
    this.addViewCallback = callback;
  }

  // Добавляем просмотр в очередь
  addView(postId: string) {
    // Проверяем кэш - уже просматривался
    if (viewsCache.has(postId)) {
      return;
    }

    // Проверяем rate limiting
    if (!viewsRateLimiter.canMakeRequest()) {
      return;
    }

    // Проверяем, не в очереди ли уже
    if (this.viewsQueue.has(postId)) {
      return;
    }

    this.viewsQueue.add(postId);
    viewsCache.add(postId); // Добавляем в кэш

    // Если достигли максимального размера батча - отправляем немедленно
    if (this.viewsQueue.size >= this.MAX_BATCH_SIZE) {
      this.processBatch();
      return;
    }

    // Устанавливаем таймер для отложенной отправки
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this.processBatch();
    }, this.BATCH_DELAY);
  }

  // Обрабатываем батч просмотров
  private async processBatch() {
    if (this.viewsQueue.size === 0 || !this.addViewCallback) {
      return;
    }

    const postIds = Array.from(this.viewsQueue);
    this.viewsQueue.clear();

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    try {
      console.log(`Обрабатываем батч из ${postIds.length} просмотров:`, postIds);
      
      await this.addViewCallback(postIds);
      console.log(`Отправлен батч просмотров для ${postIds.length} постов:`, postIds);
    } catch (error) {
      console.error('Ошибка при отправке батча просмотров:', error);
      
      // В случае ошибки можно добавить повторную попытку
      // Но не добавляем обратно в очередь, чтобы избежать бесконечного цикла
      
      // Опционально: можно сохранить в localStorage для повторной попытки позже
      try {
        const failedViews = JSON.parse(localStorage.getItem('failedViews') || '[]');
        failedViews.push(...postIds);
        localStorage.setItem('failedViews', JSON.stringify(failedViews.slice(-50))); // Сохраняем только последние 50
      } catch (storageError) {
        console.warn('Не удалось сохранить неудачные просмотры в localStorage:', storageError);
      }
    }
  }

  // Принудительно отправляем все накопленные просмотры
  flush() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
    this.processBatch();
  }

  // Очищаем очередь
  clear() {
    this.viewsQueue.clear();
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }
}

// Создаем единственный экземпляр менеджера
export const viewsManager = new ViewsManager();

// Hook для использования в компонентах
export const useViewsManager = () => {
  return {
    addView: viewsManager.addView,
    flush: viewsManager.flush,
    clear: viewsManager.clear,
  };
};
