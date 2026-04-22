"use client";
import React from "react";
import { SlUserFollow } from "react-icons/sl";
import {
  MdBlockFlipped,
  MdOutlineEdit,
  MdOutlineReportGmailerrorred,
} from "react-icons/md";
import { RiDeleteBin7Line } from "react-icons/ri";
import { Bookmark, Ellipsis, Loader2 } from "lucide-react";

import { useUserProfile } from "@/src/features/profile";
import { useCurrentUser } from "@/src/hooks/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface PostDropdownProps {
  isLoading?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
  authorId: string;
}

const PostDropdown: React.FC<PostDropdownProps> = ({
  isLoading,
  onEdit,
  onDelete,
  authorId,
  onReport,
}) => {
  const { user: currentUser } = useCurrentUser();

  const { isFollowLoading, isUnfollowLoading, handleFollow, data } =
    useUserProfile(authorId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full h-8 w-8 text-muted-foreground hover:bg-muted"
          size="icon"
          variant="ghost"
        >
          {isLoading ? (
            <Loader2 className="animate-spin size-4" />
          ) : (
            <Ellipsis size={18} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {authorId === currentUser?.id && (
          <DropdownMenuItem onClick={onEdit}>
            <MdOutlineEdit className="mr-2 size-4" />
            <span>Редактировать</span>
          </DropdownMenuItem>
        )}

        {authorId !== currentUser?.id && (
          <DropdownMenuItem
            disabled={isFollowLoading || isUnfollowLoading}
            onClick={(e) => {
              e.preventDefault();
              if (handleFollow) handleFollow();
            }}
          >
            <SlUserFollow className="mr-2 size-4" />
            <span>{data?.isFollow ? "Отписаться" : "Подписаться"}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem>
          <Bookmark className="mr-2 size-4" />
          <span>Сохранить</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onReport}>
          <MdOutlineReportGmailerrorred className="mr-2 size-4" />
          <span>Пожаловаться</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <MdBlockFlipped className="mr-2 size-4" />
          <span>Заблокировать</span>
        </DropdownMenuItem>

        {authorId === currentUser?.id && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={onDelete}
            >
              <RiDeleteBin7Line className="mr-2 size-4" />
              <span>Удалить</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostDropdown;
