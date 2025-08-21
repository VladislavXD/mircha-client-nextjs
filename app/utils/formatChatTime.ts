/**
 * Форматирует время для отображения в чатах
 */
export const formatChatTime = (dateString?: string | Date): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'сейчас';
  if (diffInMinutes < 60) return `${diffInMinutes}м`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}ч`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}д`;
  
  // Если больше недели, показываем дату
  const isThisYear = date.getFullYear() === now.getFullYear();
  if (isThisYear) {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  } else {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
  }
};

/**
 * Форматирует онлайн статус пользователя
 */
export const formatOnlineStatus = (isOnline: boolean, lastSeen?: string | Date): string => {
  if (isOnline) return 'в сети';
  if (!lastSeen) return 'не в сети';
  
  const date = new Date(lastSeen);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'только что в сети';
  if (diffInMinutes < 5) return 'был в сети недавно';
  if (diffInMinutes < 60) return `был в сети ${diffInMinutes}м назад`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `был в сети ${diffInHours}ч назад`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'был в сети вчера';
  if (diffInDays < 7) return `был в сети ${diffInDays}д назад`;
  
  return 'давно не в сети';
};

/**
 * Форматирует время сообщения для отображения в чате
 */
export const formatMessageTime = (dateString?: string | Date): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isYesterday) {
    return `вчера ${date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  }
  
  const isThisYear = date.getFullYear() === now.getFullYear();
  if (isThisYear) {
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  } else {
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  }
};
