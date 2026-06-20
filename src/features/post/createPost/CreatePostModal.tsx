"use client";

import * as React from "react";
import { useDispatch } from "react-redux";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from "@/components/ui/drawer";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import {
  closeCreatePostModal,
  selectIsCreatePostModalOpen,
} from "@/src/store/CreatePostModal/CreatePostModal.slice";
import { useAppSelector } from "@/src/hooks/reduxHooks";
import CreatePost from "@/src/features/post/createPost/CreatePost";

export function CreatePostModal() {
  const isOpen = useAppSelector(selectIsCreatePostModalOpen);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const dispatch = useDispatch();



  const handleClose = () => dispatch(closeCreatePostModal());

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[600px] p-0 border-none bg-transparent shadow-none">
          <CreatePost
            className="mb-0"
            disableViewportTracking={true}
            onSuccessComplete={handleClose}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>

      <DrawerContent className="p-0 border-none bg-transparent ">
        <CreatePost
          className="mb-0 rounded-b-none border-b-0"
          disableViewportTracking={true}
          onSuccessComplete={handleClose}
        />
      </DrawerContent>
    </Drawer>
  );
}
