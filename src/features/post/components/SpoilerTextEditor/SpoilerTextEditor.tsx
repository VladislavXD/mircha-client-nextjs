/**
 * Редактор с поддержкой спойлеров
 * - contentEditable для редактирования
 * - Кнопка при выделении текста для создания спойлера
 * - Отображение спойлеров прямо в редакторе с помощью blur эффекта
 */

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { IoEyeOffOutline } from 'react-icons/io5'

interface SpoilerTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  minHeight?: string
  className?: string
}

export const SpoilerTextEditor: React.FC<SpoilerTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Введите текст...',
  disabled = false,
  minHeight = '120px',
  className = '',
}) => {
  const [showSpoilerButton, setShowSpoilerButton] = useState(false)
  const [buttonPos, setButtonPos] = useState({ top: 0, left: 0 })
  const editorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Обработка изменений в редакторе
  const handleInput = useCallback(() => {
    if (!editorRef.current || disabled) return
    
    // Получаем весь HTML контент
    const html = editorRef.current.innerHTML
    onChange(html)
  }, [onChange, disabled])

  // Обновляем содержимое редактора когда меняется value извне
  useEffect(() => {
    if (!editorRef.current || disabled) return
    
    // Обновляем только если содержимое отличается
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value, disabled])

  // Обработка выделения текста для показа кнопки спойлера
  const handleMouseUp = useCallback(() => {
    if (disabled) return

    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      setShowSpoilerButton(false)
      return
    }

    const range = selection.getRangeAt(0)
    const container = containerRef.current

    if (!container?.contains(range.commonAncestorContainer)) {
      setShowSpoilerButton(false)
      return
    }

    const rect = range.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    setButtonPos({
      top: rect.bottom - containerRect.top + 8,
      left: rect.left - containerRect.left + rect.width / 2 - 60,
    })
    setShowSpoilerButton(true)
  }, [disabled])

  // Применение спойлера к выделенному тексту
  const applySpoiler = useCallback(() => {
    if (!editorRef.current || disabled) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    
    if (!selectedText) return

    // Создаем элемент спойлера
    const spoilerSpan = document.createElement('span')
    spoilerSpan.setAttribute('data-spoiler', 'true')
    spoilerSpan.style.filter = 'blur(5px)'
    spoilerSpan.style.cursor = 'pointer'
    spoilerSpan.style.transition = 'filter 0.2s'
    spoilerSpan.textContent = selectedText

    // Добавляем обработчик для раскрытия
    spoilerSpan.addEventListener('click', function() {
      if (this.style.filter === 'blur(5px)') {
        this.style.filter = 'none'
      } else {
        this.style.filter = 'blur(5px)'
      }
    })

    // Заменяем выделенный текст на спойлер
    range.deleteContents()
    range.insertNode(spoilerSpan)

    // Очищаем выделение
    selection.removeAllRanges()
    setShowSpoilerButton(false)

    // Уведомляем об изменении
    handleInput()
  }, [disabled, handleInput])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onMouseUp={handleMouseUp}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        style={{ minHeight }}
        className={`
          w-full p-3 rounded-lg border border-default-200
          focus:border-primary focus:outline-none transition-colors
          whitespace-pre-wrap break-words text-foreground
          ${disabled ? 'opacity-50 cursor-not-allowed bg-default-100' : 'bg-transparent'}
        `}
      />

      {/* Placeholder styling */}
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
        }
      `}</style>

      {/* Кнопка для создания спойлера */}
      {showSpoilerButton && !disabled && (
        <div
          className="absolute z-[9999]"
          style={{ 
            top: `${buttonPos.top}px`, 
            left: `${buttonPos.left}px`,
          }}
        >
          {/* Стрелка вверх */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 
            border-l-[6px] border-r-[6px] border-b-[6px] 
            border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-gray-700" 
          />
          
          {/* Кнопка */}
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
              text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg
              hover:bg-gray-800 dark:hover:bg-gray-600 
              active:scale-95 transition-all"
            onClick={applySpoiler}
            onMouseDown={(e) => e.preventDefault()} // Предотвращаем потерю выделения
          >
            <IoEyeOffOutline size={16} />
            <span>Спойлер</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default SpoilerTextEditor
