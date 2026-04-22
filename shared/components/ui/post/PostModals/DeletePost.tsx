"use client";
import React from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeletePostProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading?: boolean;
  error?: string;
}

const DeletePost: React.FC<DeletePostProps> = ({
  isOpen,
  onClose,
  onDelete,
  loading,
  error,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить пост?</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите удалить этот пост? Это действие необратимо.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-destructive text-sm font-medium mt-2">
            {error}
          </div>
        )}

        <DialogFooter className="mt-4 sm:justify-end gap-2 sm:gap-0">
          <Button disabled={loading} variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button disabled={loading} variant="destructive" onClick={onDelete}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePost;
