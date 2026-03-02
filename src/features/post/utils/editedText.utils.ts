import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"

export const getEditedText = ({isEdited, updatedAt}: {isEdited: boolean, updatedAt: string}) => {
   if (!isEdited) return null

	 const timeAgo = formatDistanceToNow(new Date(updatedAt), {
		addSuffix: true,
		locale: ru
	 })

	 return `Отредактировано ${timeAgo}`

}