import ProfileStatus from "../ProfileStatus";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800/70 p-6 rounded-[1.5rem] shadow-2xl">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4 text-center text-neutral-900 dark:text-neutral-100">
              Обновить статус
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <img
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-800/50"
                src={userAvatalUrl || "/default-avatar.png"}
              />
              <ProfileStatus status={updateStatus} />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-neutral-600 dark:text-neutral-400 pl-1"
                htmlFor="status-input"
              >
                Установите ваш статус
              </label>
              <Input
                className={`w-full bg-neutral-100 dark:bg-[#101010] border-neutral-200 dark:border-neutral-800/70 text-neutral-900 dark:text-neutral-100 rounded-[1rem] h-12 px-4 shadow-sm ${isMaxReached ? "border-red-500/50 focus-visible:ring-red-500/50" : "focus-visible:ring-neutral-500/50"}`}
                id="status-input"
                maxLength={maxLength}
                placeholder="Что шепчет твой внутренний космос?"
                type="text"
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
              />
              <div className="flex justify-between text-xs mt-1 px-1">
                <span
                  className={
                    isMaxReached
                      ? "text-red-500 dark:text-red-400"
                      : "text-neutral-500"
                  }
                >
                  {isMaxReached ? "Достигнут лимит текста" : ""}
                </span>
                <span
                  className={
                    isMaxReached
                      ? "text-red-500 dark:text-red-400"
                      : "text-neutral-500"
                  }
                >
                  {currentLength}/{maxLength}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              className="rounded-full text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button
              className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              disabled={isMaxReached || isUpdating}
              type="submit"
            >
              {isUpdating ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
