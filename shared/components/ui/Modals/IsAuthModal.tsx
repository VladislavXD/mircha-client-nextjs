"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon, LogIn, Heart, MessageCircle, Send, User, Repeat2, Pencil, Repeat } from "lucide-react";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { AuthModalIcon } from "@/src/store/authModal/authModal.slice";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon?: string;
  title?: string;
  description?: string;
  onLogin?: () => void;
};


const iconMap: Record<AuthModalIcon, LucideIcon> = {
  Heart: Heart,
  MessageCircle: MessageCircle,
  Send: Send,
  User: User,
  Repeat2: Repeat2,
  Pencil: Pencil,
  Repeat: Repeat,
};

function AuthContent({
  icon,
  title = "Войдите, чтобы продолжить",
  description = "Присоединяйтесь, чтобы делиться идеями, задавать вопросы и общаться.",
  onLogin,
  onClose,
}: Omit<Props, "open" | "onOpenChange"> & { onClose: () => void }) {
  
const Icon = icon ? iconMap[icon as AuthModalIcon] : undefined;

  return (
    <div className="flex flex-col items-center text-center px-6 py-8 gap-6">
      {/* Icon */}
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Icon className="h-7 w-7 text-foreground" strokeWidth={1.5} />
        </div>
      )}

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>

      {/* Login button */}
      <div className="w-full space-y-2 pt-1">
        <Button
          className="w-full h-14 rounded-2xl text-sm font-medium gap-3 justify-between px-5"
          variant="outline"
          onClick={onLogin}
        >
          <LogIn className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          <span className="flex-1 text-left">Войти в аккаунт</span>
          <span className="text-muted-foreground">›</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full text-muted-foreground text-sm"
          onClick={onClose}
        >
          Не сейчас
        </Button>
      </div>
    </div>
  );
}

export default function AuthDialog({
  open,
  onOpenChange,
  icon,
  title,
  description,
  onLogin,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent  className="sm:max-w-sm rounded-3xl p-0 overflow-hidden [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <AuthContent
            icon={icon}
            title={title}
            description={description}
            onLogin={onLogin}
            onClose={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-3xl">
        <DrawerHeader className="sr-only">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <AuthContent
          icon={icon}
          title={title}
          description={description}
          onLogin={onLogin}
          onClose={() => onOpenChange(false)}
        />
      </DrawerContent>
    </Drawer>
  );
}