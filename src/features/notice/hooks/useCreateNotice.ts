import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { CreateNoticeDto } from "../types";
import { noticeService } from "../services";

export function useCreateNotice() {
  const queryClient = useQueryClient();
  const { mutate: createNotice, isPending } = useMutation({
    mutationKey: ["create notice"],
    mutationFn: (body: CreateNoticeDto) => noticeService.createNotice(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices", "active"] });
      toast.success("Уведомление успешно создано");
    },
    onError: (error) => {
      toast.error("Ошибка при создании уведомления");
    },
  });

  return { createNotice, isPending };
}
