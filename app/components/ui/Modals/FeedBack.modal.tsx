'use client'
import React, { useMemo, useState, useTransition } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, Textarea, useDisclosure, addToast } from "@heroui/react";
import { useForm } from "react-hook-form";

type Props = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
	onClosse?: () => void;
};

type FormValues = {
  name?: string;
  contact?: string; // email/telegram/discord
  topic?: string;
  message: string;
};

const MAX_LEN = 1500;

const FeedBackModal: React.FC<Props> = ({isOpen, onOpenChange, onClosse}) => {
  

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { name: "", contact: "", topic: "", message: "" }
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const message = watch("message") || "";
  const left = useMemo(() => Math.max(0, MAX_LEN - message.length), [message]);

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Ошибка отправки");
      }
      startTransition(() => {
        reset();
        if (onClosse) {
          onClosse();
        }
				addToast({ color: "success", title: "Спасибо!", description: "Ваше сообщение отправлено. Ожидайте ответа!" })
				
      });
    } catch (e: any) {
      setServerError(e?.message || "Не удалось отправить сообщение");
    }
  });

  return (

		<Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size="lg"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 "
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              <h2 className="text-xl font-semibold">Обратная связь</h2>
              <p className="text-foreground/80 text-sm">Опишите проблему, идею или пожелания — мы получим это в Telegram.</p>
            </ModalHeader>
            <ModalBody className="pb-6">
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Имя (необязательно)" {...register("name", { maxLength: 64 })} />
                  <Input label="Контакт (email/telegram)" {...register("contact", { maxLength: 128 })} />
                </div>

                <Input label="Тема (необязательно)" {...register("topic", { maxLength: 120 })} />

                <div>
                  <Textarea
                    label="Сообщение"
                    labelPlacement="outside"
                    placeholder="Опишите суть обратной связи…"
                    minRows={5}
                    {...register("message", {
                      required: "Сообщение обязательно",
                      maxLength: { value: MAX_LEN, message: `Не более ${MAX_LEN} символов` }
                    })}
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-foreground/60">
                    <span>{errors.message?.message}</span>
                    <span>{left} символов</span>
                  </div>
                </div>

                {serverError && (
                  <div className="text-danger text-sm">{serverError}</div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="flat" onPress={() => onClose()}>
                    Отмена
                  </Button>
                  <Button color="primary" type="submit" isLoading={isSubmitting || isPending} isDisabled={message.length === 0}>
                    Отправить
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FeedBackModal;
