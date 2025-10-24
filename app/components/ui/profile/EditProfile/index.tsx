import React, { useContext, useState } from "react"
import { User } from "@/src/types/types"
import { useUpdateUserMutation } from "@/src/services/user/user.service"
import { useParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react"
import Input from "../../Input/Input"
import { MdOutlineEmail } from "react-icons/md"
import ErrorMessage from "../../ErrorMessage"
import { hasErrorField } from "@/app/utils/hasErrorField"
import { useTheme } from "next-themes"

type Props = {
  isOpen: boolean
  onClose: () => void
  user?: User
}

const EditProfile = ({ isOpen, onClose, user }: Props) => {
  const {theme} = useTheme()
  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { id } = useParams<{ id: string }>()

  const { handleSubmit, control } = useForm<User>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: user?.email,
      name: user?.name,
      dateOfBirth: user?.dateOfBirth,
      bio: user?.bio,
      location: user?.location,
      username: user?.username
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      setSelectedFile(e.target.files[0])
    }
  }

  const onSubmit = async (data: User) => {
    if (id) {
      try {
        const formData = new FormData()
        data.name && formData.append("name", data.name)
        data.email && data.email !== user?.email && formData.append("email", data.email)
        data.username && formData.append("username", data.username)
        data.dateOfBirth &&
          formData.append("dateOfBirth", new Date(data.dateOfBirth).toISOString())
        data.bio && formData.append("bio", data.bio)
        data.location && formData.append("location", data.location)
        selectedFile && formData.append("avatar", selectedFile)

        await updateUser({ userData: formData, id }).unwrap()
        onClose()
        setError("")
      } catch (err) {
        if (hasErrorField(err)) {
          setError(err.data.error)
        }
      }
    }
  }

  if (!control) return null
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`${theme} text-foreground`}
      backdrop="blur"
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Изменение профиля
            </ModalHeader>
            <ModalBody>
              <form
                action=""
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Input
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                  endContent={<MdOutlineEmail />}
                />
                <Input control={control} name="name" label="Никнейм" type="text" />
                <Input control={control} name="username" label="Имя пользователя" type="text" />
                <label
                  className="block mt-3 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="small_size"
                >
                  Выберите фото профиля
                </label>
                <input
                  onChange={handleFileChange}
                  className="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="small_size"
                  name="avatarUrl"
                  type="file"
                />

                <Input
                  control={control}
                  name="dateOfBirth"
                  label="Дата Рождения"
                  type="date"
                  placeholder="Дата Рождения"
                />
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} rows={4} placeholder="О вас" />
                  )}
                />
                <Input
                  control={control}
                  name="location"
                  label="Местоположение"
                  type="text"
                />
                <ErrorMessage error={error} />
                <div className="flex gap-2 justify-end">
                  <Button
                    fullWidth
                    color="primary"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Обновите профиль
                  </Button>
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Закрыть
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default EditProfile
