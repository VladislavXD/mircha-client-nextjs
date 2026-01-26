import { useState, useCallback, useEffect, useRef } from "react";

/**
 * Hook для управления кнопкой спойлера при выделении текста
 */
export const useSpoilerSelection = (
  editorRef: React.RefObject<HTMLDivElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  onSpoilerApplied?: () => void
) => {
  const [showSpoilerButton, setShowSpoilerButton] = useState(false);
  const [spoilerBtnPos, setSpoilerBtnPos] = useState({ top: 0, left: 0 });
  const spoilerButtonRef = useRef<HTMLDivElement>(null);
  const isApplyingRef = useRef(false);

  // Обработчик выделения мышью
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const editor = editorRef.current;
    const container = containerRef.current;

    if (!selection || selection.isCollapsed || !editor || !container) {
      setShowSpoilerButton(false);
      return;
    }

    const range = selection.getRangeAt(0);
    
    // Проверяем, что выделение внутри редактора
    if (!editor.contains(range.commonAncestorContainer)) {
      setShowSpoilerButton(false);
      return;
    }

    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Учитываем скролл внутри редактора
    const scrollTop = editor.scrollTop || 0;
    
    const top = rect.bottom - containerRect.top + scrollTop + 8;
    const left = rect.left - containerRect.left + rect.width / 2 - 50;
    
    setSpoilerBtnPos({ top, left });
    setShowSpoilerButton(true);
  }, [editorRef, containerRef]);

  // Функция применения спойлера к выделенному тексту
  const applySpoilerToSelection = useCallback(() => {
    isApplyingRef.current = true;
    
    const editor = editorRef.current;
    if (!editor) {
      isApplyingRef.current = false;
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      isApplyingRef.current = false;
      return;
    }

    const range = selection.getRangeAt(0);
    if (selection.isCollapsed) {
      isApplyingRef.current = false;
      return;
    }

    if (!editor.contains(range.commonAncestorContainer)) {
      isApplyingRef.current = false;
      return;
    }

    // Проверка: если выделение уже содержит спойлер, не применяем (избегаем вложенности)
    const fragment = range.cloneContents();
    const hasSpoiler = fragment.querySelector('[data-spoiler="true"]');
    if (hasSpoiler) {
      selection.removeAllRanges();
      setShowSpoilerButton(false);
      isApplyingRef.current = false;
      return;
    }

    // Проверка: если родитель выделения — спойлер, не применяем
    let node: Node | null = range.commonAncestorContainer;
    while (node && node !== editor) {
      if ((node as HTMLElement).getAttribute?.("data-spoiler") === "true") {
        selection.removeAllRanges();
        setShowSpoilerButton(false);
        isApplyingRef.current = false;
        return;
      }
      node = node.parentNode;
    }

    const span = document.createElement("span");
    span.setAttribute("data-spoiler", "true");
    span.className = "mc-spoiler";

    try {
      // Пытаемся обернуть простым способом
      range.surroundContents(span);
    } catch (e) {
      // Если не удалось (частично выделены элементы), используем extractContents
      try {
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
      } catch (err) {
        console.error("Failed to apply spoiler:", err);
        selection.removeAllRanges();
        setShowSpoilerButton(false);
        isApplyingRef.current = false;
        return;
      }
    }

    // ВАЖНО: Перемещаем курсор за пределы спойлера
    // Создаем пробел после спойлера, чтобы можно было продолжить печатать
    const spaceNode = document.createTextNode('\u00A0'); // неразрывный пробел
    if (span.nextSibling) {
      editor.insertBefore(spaceNode, span.nextSibling);
    } else {
      editor.appendChild(spaceNode);
    }
    
    // Устанавливаем курсор после пробела
    const newRange = document.createRange();
    newRange.setStartAfter(spaceNode);
    newRange.collapse(true);
    
    selection.removeAllRanges();
    selection.addRange(newRange);
    setShowSpoilerButton(false);
    
    // Вызываем callback для сериализации
    if (onSpoilerApplied) {
      onSpoilerApplied();
    }
    
    // Триггерим событие input для обновления контента
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Сбрасываем флаг
    setTimeout(() => {
      isApplyingRef.current = false;
    }, 100);
  }, [editorRef, onSpoilerApplied]);

  // Клик по спойлеру для раскрытия
  const toggleSpoilerClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.classList.contains("mc-spoiler") ||
      target.closest(".mc-spoiler")
    ) {
      const spoiler = target.classList.contains("mc-spoiler")
        ? target
        : target.closest(".mc-spoiler");
      if (spoiler) {
        spoiler.classList.toggle("mc-spoiler--revealed");
      }
    }
  }, []);

  // Скрываем кнопку при клике вне редактора
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Не скрываем если клик по самой кнопке или во время применения
      if (isApplyingRef.current) return;
      if (spoilerButtonRef.current?.contains(target)) return;
      if (!editorRef.current?.contains(target)) {
        setShowSpoilerButton(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editorRef]);

  // Отслеживаем изменения выделения (включая Ctrl+A, Shift+Arrow)
  useEffect(() => {
    const handleSelectionChange = () => {
      // Не проверяем выделение если применяем спойлер
      if (isApplyingRef.current) return;
      
      const selection = window.getSelection();
      const editor = editorRef.current;
      const container = containerRef.current;

      if (!selection || selection.isCollapsed || !editor || !container) {
        setShowSpoilerButton(false);
        return;
      }

      const range = selection.getRangeAt(0);
      
      // Проверяем, что выделение внутри редактора
      if (!editor.contains(range.commonAncestorContainer)) {
        setShowSpoilerButton(false);
        return;
      }

      const rect = range.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Учитываем скролл
      const scrollTop = editor.scrollTop || 0;
      
      const top = rect.bottom - containerRect.top + scrollTop + 8;
      const left = rect.left - containerRect.left + rect.width / 2 - 50;
      
      setSpoilerBtnPos({ top, left });
      setShowSpoilerButton(true);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [editorRef, containerRef]);

  return {
    showSpoilerButton,
    spoilerBtnPos,
    handleMouseUp,
    applySpoilerToSelection,
    toggleSpoilerClick,
    spoilerButtonRef,
  };
};
