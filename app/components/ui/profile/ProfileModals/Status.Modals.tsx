import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
} from "@heroui/react";

import ProfileStatus from "../ProfileStatus";
import { useState } from "react";
import { useUpdateUserMutation } from "@/src/services/user/user.service";
import { User } from "@/src/types/types";
import { useSelector } from "react-redux";
import { selectCurrent } from "@/src/store/user/user.slice";

type Props = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  userAvatalUrl?: string;
  status?: string;
};

export default function StatusModal({
  isOpen,
  onOpenChange,
  userAvatalUrl,
  status,
}: Props) {
  const [updateStatus, setUpdateStatus] = useState<string | undefined>(status);
  const maxLength = 60;
  const currentLength = updateStatus?.length || 0;
  const isMaxReached = currentLength >= maxLength;
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const current = useSelector(selectCurrent);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (current?.id) {
      try {
        const formData = new FormData();
        if (updateStatus) {
          formData.append("status", updateStatus);
        }

        await updateUser({ userData: formData, id: current.id }).unwrap();

        // Закрываем модалку после успешного обновления
        onOpenChange?.(false);
      } catch (err: unknown) {
        console.error("Error updating status:", err);
      }
    }
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop:
          "bg-linear-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={onSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Обновить статус
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex justify-center flex-col items-center gap-2">
                  <Image
                    src={userAvatalUrl || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <ProfileStatus status={status ? status : updateStatus} />
                </div>
                <div className="space-y-1">
                  <Input
                    type="text"
                    label="Установите ваш статус"
                    placeholder="Что шепчет твой внутренний космос?"
                    className="w-full"
                    value={status ? status : updateStatus || ""}
                    maxLength={maxLength}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    isInvalid={isMaxReached}
                    errorMessage={
                      isMaxReached ? "Достигнут лимит текста" : ""
                    }
                    description={
                      <span
                        className={
                          isMaxReached ? "text-danger" : "text-default-400"
                        }
                      >
                        {currentLength}/{maxLength}
                      </span>
                    }
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Отмена
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isLoading}
              >
                Сохранить
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
