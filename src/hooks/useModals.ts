import { useDisclosure } from "@/src/hooks/useDisclosure";

export const useModals = () => {
  const deleteModal = useDisclosure();
  const shareModal = useDisclosure();
  const editModal = useDisclosure();
  const reportModal = useDisclosure();
  const commentsModal = useDisclosure();
  const SettingsDropdown = useDisclosure();
  const isAuthModal = useDisclosure();


  return {
    deleteModal,
    shareModal,
    editModal,
    reportModal,
    commentsModal,
    SettingsDropdown,
    isAuthModal
  };
};  