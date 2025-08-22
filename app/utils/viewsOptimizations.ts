// Дополнительные оптимизации для высоконагруженных систем

// 1. Throttling для Intersection Observer
export const createThrottledObserver = (callback: Function, delay: number = 100) => {
  let lastCall = 0;
  
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
};

// 2. Debounce для быстрой прокрутки
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 3. Кэш для уже просмотренных постов (клиентская сторона)
export class ViewsCache {
  private cache = new Set<string>();
  private readonly MAX_CACHE_SIZE = 1000;

  has(postId: string): boolean {
    return this.cache.has(postId);
  }

  add(postId: string): void {
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // Удаляем старые записи (FIFO)
      const firstItem = this.cache.values().next().value;
      if (firstItem) {
        this.cache.delete(firstItem);
      }
    }
    this.cache.add(postId);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const viewsCache = new ViewsCache();

// 4. Rate limiting на клиенте
export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 50, timeWindow: number = 60000) { // 50 запросов в минуту
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    
    // Удаляем старые запросы
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      console.warn('Rate limit reached for views');
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
}

export const viewsRateLimiter = new RateLimiter();
