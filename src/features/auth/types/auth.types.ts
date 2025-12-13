import { IUser } from "../../user/types";


/**
 * Интерфейс для ответа аутентификации.
 */
export interface IAuthResponse {
	user: IUser
}
