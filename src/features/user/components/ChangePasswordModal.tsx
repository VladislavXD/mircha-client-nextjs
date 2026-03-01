'use client'

import { useState } from 'react'
import { 
	Modal, 
	ModalContent, 
	ModalHeader, 
	ModalBody, 
	ModalFooter,
	Button,
	Input
} from '@heroui/react'
import { Eye, EyeOff, Key } from 'lucide-react'
import { useChangePassword } from '../hooks'

interface ChangePasswordModalProps {
	isOpen: boolean
	onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [error, setError] = useState('')

	const { changePassword, isLoading, isSuccess } = useChangePassword()

	const handleSubmit = () => {
		setError('')

		// Валидация
		if (!currentPassword || !newPassword || !confirmPassword) {
			setError('Заполните все поля')
			return
		}

		if (newPassword.length < 6) {
			setError('Новый пароль должен содержать минимум 6 символов')
			return
		}

		if (newPassword !== confirmPassword) {
			setError('Новый пароль и подтверждение не совпадают')
			return
		}

		if (currentPassword === newPassword) {
			setError('Новый пароль должен отличаться от текущего')
			return
		}

		// Отправка
		changePassword(
			{ currentPassword, newPassword },
			{
				onSuccess: () => {
					// Закрываем модалку и очищаем поля
					handleClose()
				}
			}
		)
	}

	const handleClose = () => {
		setCurrentPassword('')
		setNewPassword('')
		setConfirmPassword('')
		setError('')
		setShowCurrentPassword(false)
		setShowNewPassword(false)
		setShowConfirmPassword(false)
		onClose()
	}

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={handleClose}
			size="md"
			classNames={{
				base: "rounded-none sm:rounded-xl",
				header: "border-b border-divider",
				body: "py-6",
				footer: "border-t border-divider"
			}}
		>
			<ModalContent>
				<ModalHeader className="flex items-center gap-2">
					<Key className="w-5 h-5 text-primary" />
					<span>Смена пароля</span>
				</ModalHeader>
				<ModalBody>
					<div className="flex flex-col gap-4">
						{/* Текущий пароль */}
						<Input
							label="Текущий пароль"
							placeholder="Введите текущий пароль"
							type={showCurrentPassword ? 'text' : 'password'}
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							endContent={
								<button
									className="focus:outline-none"
									type="button"
									onClick={() => setShowCurrentPassword(!showCurrentPassword)}
								>
									{showCurrentPassword ? (
										<EyeOff className="w-4 h-4 text-default-400" />
									) : (
										<Eye className="w-4 h-4 text-default-400" />
									)}
								</button>
							}
						/>

						{/* Новый пароль */}
						<Input
							label="Новый пароль"
							placeholder="Введите новый пароль"
							type={showNewPassword ? 'text' : 'password'}
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							endContent={
								<button
									className="focus:outline-none"
									type="button"
									onClick={() => setShowNewPassword(!showNewPassword)}
								>
									{showNewPassword ? (
										<EyeOff className="w-4 h-4 text-default-400" />
									) : (
										<Eye className="w-4 h-4 text-default-400" />
									)}
								</button>
							}
						/>

						{/* Подтверждение нового пароля */}
						<Input
							label="Подтвердите новый пароль"
							placeholder="Введите новый пароль еще раз"
							type={showConfirmPassword ? 'text' : 'password'}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							endContent={
								<button
									className="focus:outline-none"
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? (
										<EyeOff className="w-4 h-4 text-default-400" />
									) : (
										<Eye className="w-4 h-4 text-default-400" />
									)}
								</button>
							}
						/>

						{/* Ошибка валидации */}
						{error && (
							<p className="text-sm text-danger">{error}</p>
						)}

						{/* Подсказка */}
						
					</div>
				</ModalBody>
				<ModalFooter>
					<Button 
						variant="flat" 
						onPress={handleClose}
						isDisabled={isLoading}
					>
						Отмена
					</Button>
					<Button 
						color="primary" 
						onPress={handleSubmit}
						isLoading={isLoading}
					>
						Изменить пароль
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
