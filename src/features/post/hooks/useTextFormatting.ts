import { useState, useCallback, useEffect } from "react";

/**
 * Hook для управления форматированием текста (bold, italic, underline, strikethrough, highlight)
 */
export const useTextFormatting = (editorRef: React.RefObject<HTMLDivElement>) => {
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  // Функция для обновления состояния активных форматов
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough');
    
    // Проверяем highlight более гибко
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let node = range.startContainer;
      
      // Проверяем текущий узел и его родителей
      let hasHighlight = false;
      let currentNode: Node | null = node;
      
      while (currentNode && currentNode !== editorRef.current) {
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
          const element = currentNode as HTMLElement;
          if (element.tagName === 'MARK') {
            hasHighlight = true;
            break;
          }
          const bgColor = window.getComputedStyle(element).backgroundColor;
          // Проверяем, есть ли желтоватый фон (подсветка)
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            // Проверяем, является ли это нашим цветом подсветки
            if (bgColor.includes('255, 235, 59') || bgColor.includes('255,235,59')) {
              hasHighlight = true;
              break;
            }
          }
        }
        currentNode = currentNode.parentNode;
      }
      
      if (hasHighlight) {
        formats.add('highlight');
      }
    }
    
    setActiveFormats(formats);
  }, [editorRef]);

  // Функция для применения форматирования
  const applyFormat = useCallback((command: string, value?: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    
    // Для highlight используем специальную обработку
    if (command === 'hiliteColor') {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const isHighlighted = activeFormats.has('highlight');
      
      if (isHighlighted) {
        // Убираем highlight - находим все <mark> элементы в выделении и разворачиваем их
        const container = range.commonAncestorContainer;
        const parentElement = container.nodeType === Node.TEXT_NODE 
          ? container.parentElement 
          : container as HTMLElement;
        
        if (parentElement) {
          // Ищем родительский <mark> элемент
          let markElement = parentElement.closest('mark');
          if (markElement && editor.contains(markElement)) {
            // Заменяем <mark> на его содержимое
            const textContent = markElement.textContent || '';
            const textNode = document.createTextNode(textContent);
            markElement.replaceWith(textNode);
            
            // Восстанавливаем выделение
            const newRange = document.createRange();
            newRange.selectNodeContents(textNode);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      } else {
        // Применяем highlight
        const color = value || 'rgba(255, 235, 59, 0.3)';
        document.execCommand('hiliteColor', false, color);
        // Если не сработало, пробуем backColor
        if (!document.queryCommandState('hiliteColor')) {
          document.execCommand('backColor', false, color);
        }
      }
    } else {
      // Для остальных команд execCommand сам переключает состояние
      document.execCommand(command, false, value);
    }

    // Обновляем состояние активных форматов
    setTimeout(() => {
      updateActiveFormats();
    }, 10);
  }, [editorRef, activeFormats, updateActiveFormats]);

  // Обработчик нажатия клавиш для автоотключения подсветки при пробеле
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const editor = editorRef.current;
    if (!editor) return;
    
    // Проверяем нажатие пробела и активную подсветку
    if (e.key === ' ' && activeFormats.has('highlight')) {
      // Ждем, пока пробел будет введен, затем отключаем highlight
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        const container = range.startContainer;
        const parentElement = container.nodeType === Node.TEXT_NODE 
          ? container.parentElement 
          : container as HTMLElement;
        
        if (parentElement) {
          // Ищем родительский <mark> элемент
          let markElement = parentElement.closest('mark');
          if (markElement && editor.contains(markElement)) {
            // Получаем текущую позицию курсора
            const offset = range.startOffset;
            const textContent = markElement.textContent || '';
            
            // Разделяем текст на две части: до пробела (с подсветкой) и после (без)
            const beforeSpace = textContent.substring(0, offset);
            const afterSpace = textContent.substring(offset);
            
            // Создаем новый <mark> для текста до пробела
            const newMark = document.createElement('mark');
            newMark.style.backgroundColor = 'rgba(255, 235, 59, 0.3)';
            newMark.style.color = 'inherit';
            newMark.textContent = beforeSpace;
            
            // Создаем текстовый узел для текста после пробела
            const afterNode = document.createTextNode(afterSpace);
            
            // Заменяем старый mark
            markElement.replaceWith(newMark, afterNode);
            
            // Устанавливаем курсор после пробела
            const newRange = document.createRange();
            newRange.setStart(afterNode, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
        
        updateActiveFormats();
      }, 0);
    }
  }, [editorRef, activeFormats, updateActiveFormats]);

  // Обновляем активные форматы при изменении выделения
  useEffect(() => {
    const handleSelectionChange = () => {
      const editor = editorRef.current;
      const selection = window.getSelection();
      
      if (editor && selection && editor.contains(selection.anchorNode)) {
        updateActiveFormats();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [editorRef, updateActiveFormats]);

  return {
    activeFormats,
    applyFormat,
    handleKeyDown,
    updateActiveFormats,
  };
};
