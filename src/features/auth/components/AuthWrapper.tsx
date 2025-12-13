'use client'

import { Card, CardBody, CardHeader, Link } from '@heroui/react'
import { ReactNode } from 'react'

interface AuthWrapperProps {
	/** Заголовок формы */
	heading?: string
	/** Описание/подзаголовок */
	description?: string
	/** Текст ссылки "назад" */
	backButtonLabel?: string
	/** URL для ссылки "назад" */
	backButtonHref?: string
	/** Содержимое формы */
	children: ReactNode
	/** Ширина карточки (по умолчанию 340px как в AuthPage) */
	cardWidth?: string
}

/**
 * Универсальная обертка для auth-форм.
 * Рендерит карточку с заголовком и содержимым, без табов.
 * Используется для страниц сброса пароля, подтверждения и т.д.
 */
export function AuthWrapper({
	heading,
	description,
	backButtonLabel,
	backButtonHref,
	children,
	cardWidth = 'w-[340px]'
}: AuthWrapperProps) {
	return (
		<div className="flex items-center justify-center min-h-screen py-8">
			<div className="flex flex-col">
				<Card className={`max-w-full ${cardWidth}`}>
					{(heading || description) && (
						<CardHeader className="flex flex-col gap-2 pb-0 pt-6 px-6">
							{heading && (
								<h1 className="text-2xl font-bold text-center">{heading}</h1>
							)}
							{description && (
								<p className="text-sm text-default-500 text-center">{description}</p>
							)}
						</CardHeader>
					)}
					<CardBody className="overflow-hidden px-6 py-6">
						{children}
					</CardBody>
					{backButtonLabel && backButtonHref && (
						<div className="px-6 pb-6 pt-0">
							<Link
								href={backButtonHref}
								size="sm"
								className="text-center block"
							>
								{backButtonLabel}
							</Link>
						</div>
					)}
				</Card>
			</div>
		</div>
	)
}
