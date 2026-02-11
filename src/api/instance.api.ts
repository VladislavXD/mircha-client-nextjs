import { FetchClient } from "../utils/fetch/fetch-client"

/**
 * Экземпляр клиента для выполнения HTTP-запросов к API.
 */
export const api = new FetchClient({
	baseUrl: process.env.NEXT_PUBLIC_SERVER_URL_AUTH as string,
	options: {
		credentials: 'include'
	}
})
