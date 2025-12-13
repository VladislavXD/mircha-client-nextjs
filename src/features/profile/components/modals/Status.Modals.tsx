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

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userAvatalUrl?: string;
  updateStatus: string;
  setUpdateStatus: (value: string) => void;
  maxLength: number;
  currentLength: number;
  isMaxReached: boolean;
  isUpdating: boolean;
  onSave: (e?: React.FormEvent) => void;
};

export default function StatusModal({
  isOpen,
  onOpenChange,
  userAvatalUrl,
  updateStatus,
  setUpdateStatus,
  maxLength,
  currentLength,
  isMaxReached,
  isUpdating,
  onSave,
}: Props) {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(e);
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
                  <ProfileStatus status={updateStatus} />
                </div>
                <div className="space-y-1">
                  <Input
                    type="text"
                    label="Установите ваш статус"
                    placeholder="Что шепчет твой внутренний космос?"
                    className="w-full"
                    value={updateStatus}
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
                isLoading={isUpdating}
                disabled={isMaxReached || isUpdating}
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
