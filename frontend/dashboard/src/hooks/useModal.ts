import { useState, useCallback } from "react";
import Modal from "@/components/common/Modal";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    open,
    close,
    Modal,
  };
};

export default useModal;
