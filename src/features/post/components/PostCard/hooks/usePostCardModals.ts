import { useDisclosure } from "@heroui/react";

export const usePostCardModals = () => {
  const deleteModal = useDisclosure();
  const shareModal = useDisclosure();
  const editModal = useDisclosure();
  const reportModal = useDisclosure();
  const commentsModal = useDisclosure();

  return {
    deleteModal,
    shareModal,
    editModal,
    reportModal,
    commentsModal,
  };
};
