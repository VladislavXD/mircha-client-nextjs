import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

import { changelog } from "./changeLog.data";
import ChangelogItem from "./changeLogItem.data";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";

// ─────────────────────────────────────────────
//  Пропсы
// ─────────────────────────────────────────────

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// ─────────────────────────────────────────────
//  Шапка — одна для модалки и drawer
// ─────────────────────────────────────────────

function ChangelogHeader() {
  return (
    <div className="flex items-center gap-2">
      <Sparkles size={18} className="text-primary" />
      <span className="font-semibold text-base flex-1">Последние обновления</span>
      <span className="text-xs text-muted-foreground">
        {changelog.length} релиза
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Тело — список записей
// ─────────────────────────────────────────────

function ChangelogBody() {
  return (
    <div className="px-4 sm:px-6 py-4">
      {changelog.map((entry, i) => (
        <ChangelogItem key={entry.version} entry={entry} isFirst={i === 0} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Футер
// ─────────────────────────────────────────────

function ChangelogFooter({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-xs text-muted-foreground">
        Обновляется с каждым релизом
      </span>
      <Button variant="outline" size="sm" onClick={onClose}>
        Закрыть
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Модалка (ПК)
// ─────────────────────────────────────────────

function ChangelogDesktopModal({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4 border-b">
          <ChangelogHeader />
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          <ChangelogBody />
        </div>

        <DialogFooter className="px-6 py-3 border-t">
          <ChangelogFooter onClose={onClose} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
//  Drawer (телефон)
// ─────────────────────────────────────────────

function ChangelogMobileDrawer({ isOpen, onClose }: Props) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90dvh] flex flex-col">
        <DrawerHeader className="px-4 pt-4 pb-3 border-b text-left">
          <ChangelogHeader />
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto">
          <ChangelogBody />
        </div>

        <DrawerFooter className="px-4 py-3 border-t">
          <ChangelogFooter onClose={onClose} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// ─────────────────────────────────────────────
//  Точка входа — выбирает нужный вариант
// ─────────────────────────────────────────────

export default function ChangelogModal(props: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) return <ChangelogMobileDrawer {...props} />;
  return <ChangelogDesktopModal {...props} />;
}