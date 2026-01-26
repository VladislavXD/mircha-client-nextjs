/**
 * Компонент для отображения контента с поддержкой спойлеров
 * Рендерит HTML, созданный в SpoilerTextEditor
 */

'use client'

import { useEffect, useRef } from 'react'

interface SpoilerContentProps {
  html: string
  className?: string
}

export const SpoilerContent: React.FC<SpoilerContentProps> = ({ html, className = '' }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // Находим все спойлеры и добавляем обработчики
    const spoilers = contentRef.current.querySelectorAll('[data-spoiler="true"]')
    
    spoilers.forEach((spoiler) => {
      const element = spoiler as HTMLElement
      
      // Убираем старые обработчики если есть
      const newElement = element.cloneNode(true) as HTMLElement
      element.parentNode?.replaceChild(newElement, element)
      
      // Добавляем обработчик клика
      newElement.addEventListener('click', function() {
        if (this.style.filter === 'blur(5px)' || this.style.filter === '') {
          this.style.filter = 'none'
        } else {
          this.style.filter = 'blur(5px)'
        }
      })
    })
  }, [html])

  return (
    <div
      ref={contentRef}
      className={`whitespace-pre-wrap break-words text-foreground ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default SpoilerContent
