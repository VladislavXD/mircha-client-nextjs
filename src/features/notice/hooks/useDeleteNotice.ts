import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { noticeService } from "../services";

export function useDeleteNotice() {
  const queryClient = useQueryClient();
  const { mutate: deleteNotice, isPending } = useMutation({
    mutationFn: (noticeId: string) => noticeService.deleteNotice(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices", "active"] });
      toast.success("Уведомление успешно удалено");
    },
    onError: (error) => {
      toast.error("Ошибка при удалении уведомления");
    },
  });

  return { deleteNotice, isPending };
}
