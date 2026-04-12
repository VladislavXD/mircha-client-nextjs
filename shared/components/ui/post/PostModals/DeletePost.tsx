"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import React from "react";

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
    <Modal hideCloseButton isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Удалить пост?</ModalHeader>
        <ModalBody>
          <p>
            Вы уверены, что хотите удалить этот пост? Это действие необратимо.
          </p>
          {error && <div className="text-danger text-xs mt-2">{error}</div>}
        </ModalBody>
        <ModalFooter>
          <Button disabled={loading} variant="light" onPress={onClose}>
            Отмена
          </Button>
          <Button color="danger" isLoading={loading} onPress={onDelete}>
            {"Удалить"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeletePost;
