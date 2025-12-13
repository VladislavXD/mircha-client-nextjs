"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Textarea } from '@heroui/react'

export type RichTextareaProps = {
  value: string
  onChange: (next: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  plugins?: Array<React.FC<RichTextareaPluginProps>>
}

export type RichTextareaPluginProps = {
  value: string
  setValue: (next: string) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  disabled?: boolean
}

const RichTextarea: React.FC<RichTextareaProps> = ({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  plugins = []
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleValueChange = (newValue: string) => {
    onChange(newValue)
  }

  return (
    <div className={className}>
      <Textarea
        value={value}
        ref={textareaRef}
        labelPlacement='outside'
        placeholder={placeholder}
        className='mb-3 whitespace-pre-wrap'
        disabled={disabled}
        onValueChange={handleValueChange}
      />

      {/* Плагины рендерятся ниже textarea, каждый сам решает, что показывать (кнопки, меню, оверлеи) */}
      {plugins.map((Plugin, idx) => (
        <Plugin
          key={idx}
          value={value}
          setValue={onChange}
          textareaRef={textareaRef}
          disabled={disabled}
        />
      ))}
    </div>
  )
}

// =====================
// Плагины по умолчанию
// =====================

// Emoji Plugin
import EmojiPicker from './EmojiPicker'
export const createEmojiPlugin = (opts?: { onUrlsChange?: (urls: string[]) => void }) => {
  const EmojiPlugin: React.FC<RichTextareaPluginProps> = ({ value, setValue, textareaRef, disabled }) => {
    const [emojiUrls, setEmojiUrls] = useState<string[]>([])

    const handleEmojiSelect = (emojiUrl: string) => {
      const textarea = textareaRef.current
      if (!textarea) return
      const cursorPosition = textarea.selectionStart || 0
      const textBefore = value.substring(0, cursorPosition)
      const textAfter = value.substring(cursorPosition)
      const emojiIndex = emojiUrls.length
      const emojiMarker = `[emoji:${emojiIndex}]`
      const newText = textBefore + emojiMarker + textAfter
  const nextUrls = [...emojiUrls, emojiUrl]
  setValue(newText)
  setEmojiUrls(nextUrls)
  // Сообщаем вверх только в момент изменения, исключаем бесконечные циклы из useEffect
  opts?.onUrlsChange?.(nextUrls)
      setTimeout(() => {
        const newCursorPosition = cursorPosition + emojiMarker.length
        textarea.setSelectionRange(newCursorPosition, newCursorPosition)
        textarea.focus()
      }, 0)
    }

    return (
      <div className='mb-3 flex gap-3 '>
        <EmojiPicker onEmojiSelect={handleEmojiSelect} disabled={disabled} />
      </div>
    )
  }
  return EmojiPlugin
}

// Mention Plugin
import Mention from './Mention'
export const createMentionPlugin = () => {
  const MentionPlugin: React.FC<RichTextareaPluginProps> = ({ value, setValue, textareaRef }) => {
    const [mention, setMention] = useState<string>('')
    const [showHit, setShowHit] = useState<boolean>(false)
    const [atStartIndex, setAtStartIndex] = useState<number | null>(null)

    useEffect(() => {
      const atIndex = value.lastIndexOf('@')
      if (atIndex !== -1) {
        const query = value.slice(atIndex + 1)
        if (!query || query.includes(' ') || query.includes('@')) {
          setShowHit(false)
        } else {
          setMention(query)
          setShowHit(true)
          setAtStartIndex(atIndex)
        }
      } else {
        setShowHit(false)
        setAtStartIndex(null)
      }
    }, [value])

    const handleSelectMention = (user: { id: string; name?: string | null }) => {
      const textarea = textareaRef.current
      const name = (user.name || '').trim()
      if (!textarea || atStartIndex === null) return

      const token = `[mention:${user.id}|${name || 'user'}]`

      const before = value.slice(0, atStartIndex)
      const cursor = textarea.selectionStart || atStartIndex + 1
      const after = value.slice(cursor)
      const next = `${before}${token}${after}`

      setValue(next)
      setShowHit(false)
      setMention('')
      setAtStartIndex(null)

      const newPos = before.length + token.length
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(newPos, newPos)
      }, 0)
    }

    return showHit ? (
      <Mention showHit={showHit} mention={mention} onSelect={handleSelectMention} />
    ) : null
  }
  return MentionPlugin
}

export default RichTextarea
