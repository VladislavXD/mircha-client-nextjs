"use client"
import React, { useEffect, useRef, useState } from 'react'

type Snowflake = {
  x: number
  y: number
  radius: number
  speed: number
  drift: number
  opacity: number
}

type SnowfallProps = {
  enabled?: boolean
  density?: number // количество снежинок
}

/**
 * Падающий снег на canvas.
 * Оптимизирован для производительности, не мешает UI.
 */
const Snowfall: React.FC<SnowfallProps> = ({ enabled = true, density = 50 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snowflakesRef = useRef<Snowflake[]>([])
  const animationIdRef = useRef<number>()

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Устанавливаем размер canvas
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Создаём снежинки
    const createSnowflakes = () => {
      snowflakesRef.current = Array.from({ length: density }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height, // начинаем выше экрана
        radius: Math.random() * 3 + 1, // 1-4px
        speed: Math.random() * 1 + 0.5, // скорость падения
        drift: Math.random() * 0.5 - 0.25, // боковой дрейф
        opacity: Math.random() * 0.6 + 0.3 // 0.3-0.9
      }))
    }
    createSnowflakes()

    // Анимация
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      snowflakesRef.current.forEach((flake) => {
        // Обновляем позицию
        flake.y += flake.speed
        flake.x += flake.drift

        // Если снежинка упала — возвращаем наверх
        if (flake.y > canvas.height) {
          flake.y = -10
          flake.x = Math.random() * canvas.width
        }

        // Если ушла за край — возвращаем
        if (flake.x > canvas.width) flake.x = 0
        if (flake.x < 0) flake.x = canvas.width

        // Рисуем снежинку
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()
      })

      animationIdRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [enabled, density])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  )
}

export default Snowfall
