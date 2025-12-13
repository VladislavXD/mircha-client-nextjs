import { api } from '@/src/api'

import type { TypeSettingsSchema } from '../schemes'
import { IUser } from '../types'


/**
 * Сервис для работы с пользователями.
 */
class UserService {
	/**
	 * Получает профиль текущего пользователя.
	 *
	 * @returns {Promise<IUser>} - Профиль пользователя.
	 */
	public async findProfile() {
		try {
			const response = await api.get<IUser>('users/profile')
			return response
		} catch (error: any) {
			const status = error?.status ?? error?.response?.status
			if (status === 401) {
				// Не авторизован — возвращаем undefined для корректной работы публичного UI
				return undefined as unknown as IUser
			}
			console.error('❌ Error fetching current profile:', error)
			throw error
		}
	}
	
	/**
	 * Получает профиль пользователя по ID.
	 *
	 * @param {string} id - ID пользователя.
	 * @returns {Promise<IUser>} - Профиль пользователя.
	 */
	public async getUserById(id: string) {
		try {
			const response = await api.get<IUser>(`users/${id}`)
			return response
		} catch (error) {
			console.error('❌ Error fetching user by ID:', id, error)
			throw error
		}
	}

	/**
	 * Обновляет профиль текущего пользователя.
	 *
	 * @param {TypeSettingsSchema} body - Данные для обновления профиля.
	 * @returns {Promise<IUser>} - Обновленный профиль пользователя.
	 */
	public async updateProfile(body: TypeSettingsSchema | FormData) {
		const response = await api.patch<IUser>('users/profile', body)
		return response
	}


	public async searchUser(query: string){
		const response = await api.get<IUser[]>(`users/search/?query=${encodeURIComponent(query)}`)
		return response
	}



}

export const userService = new UserService()
