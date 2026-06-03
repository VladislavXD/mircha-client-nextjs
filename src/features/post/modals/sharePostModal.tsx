import { toast } from "sonner";
import {
  Link as LinkIcon,
  Search,
  MessageCircle,
  Mail,
  Check,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useSearchUsers } from "@/src/features/user";

interface shareDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  linkToCopy: string;
}

export default function ShareModal({
  linkToCopy,
  isOpen,
  onClose,
}: shareDropdownProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );

  const { data: users = [], isLoading } = useSearchUsers(debouncedQuery);

  const t = useTranslations("Toasts");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 5000); // Сброс состояния через 5 секунд

      toast.success(t("linkCopied"));
    } catch (e) {
      console.error("Failed to copy link: ", e);
    }
  };

  const toggleUser = (userId: string) => {
    const newSet = new Set(selectedUserIds);

    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setSelectedUserIds(newSet);
  };

  const handleSend = () => {
    // В будущем тут будет API логика
    toast.success("Отправлено (в разработке)");
    setSelectedUserIds(new Set());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="p-0 sm:max-w-md gap-0 overflow-hidden bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="px-4 pt-4 pb-0 text-left">
          <DialogTitle className="text-base font-semibold text-center">
            Отправить
          </DialogTitle>
          <DialogDescription className="sr-only">
            Поделиться постом
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 pr-9 h-10 bg-muted/60 border-none rounded-xl"
              placeholder="Поиск пользователей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
            )}
          </div>
        </div>

        <div className="flex-1 max-h-[40vh] overflow-y-auto no-scrollbar">
          <div className="px-2 pb-2 flex flex-col min-h-[120px]">
            {users.length > 0 ? (
              users.map((user) => {
                const isSelected = selectedUserIds.has(user.id);
                const displayName =
                  user.username || user.name.toLowerCase().replace(/\s/g, "_");

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2.5 px-3 hover:bg-muted/40 rounded-xl cursor-pointer transition-colors"
                    onClick={() => toggleUser(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-11 h-11">
                        <AvatarImage
                          className="object-cover"
                          src={user.avatarUrl}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold leading-none mb-1 text-foreground">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground leading-none">
                          @{displayName}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-primary-foreground stroke-[3]" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : !isLoading && searchQuery.length >= 2 ? (
              <div className="py-8 text-center text-sm text-muted-foreground flex items-center justify-center h-full">
                Пользователи не найдены
              </div>
            ) : !isLoading ? (
              <div className="py-8 text-center text-xs text-muted-foreground/70 flex items-center justify-center h-full px-8">
                Начните вводить имя пользователя для поиска
              </div>
            ) : null}
          </div>
        </div>

        {selectedUserIds.size > 0 && (
          <div className="px-4 pb-4 pt-1 bg-background">
            <Button
              className="w-full rounded-xl font-semibold h-11"
              onClick={handleSend}
            >
              Отправить
            </Button>
          </div>
        )}

        <Separator className="bg-border/60" />

        <div className="p-4 bg-background">
          <div className="flex gap-5 overflow-x-auto no-scrollbar items-start">
            <button
              className="flex flex-col items-center gap-2 min-w-[72px] shrink-0 outline-none"
              onClick={copyToClipboard}
            >
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center transition-transform hover:bg-muted/80 active:scale-95">
                <LinkIcon className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xs font-medium text-center text-foreground">
                {isCopied ? "Скопировано" : "Копировать"}
              </span>
            </button>

            <button className="flex flex-col items-center gap-2 min-w-[72px] shrink-0 outline-none opacity-50 cursor-not-allowed">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xs font-medium text-center text-foreground">
                Чат
              </span>
            </button>

            <button className="flex flex-col items-center gap-2 min-w-[72px] shrink-0 outline-none opacity-50 cursor-not-allowed">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Mail className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xs font-medium text-center text-foreground">
                Email
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
