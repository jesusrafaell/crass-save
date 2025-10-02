"use client";
import {
  Button,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import {
  Dispatch,
  FC,
  SetStateAction,
  useRef,
  useState,
} from "react";


interface PrivatePolicyModalProps {
  isOpen?: boolean;
  setupdated?: Dispatch<SetStateAction<boolean>>;
  onClose?: any;
  handleModal?: () => void;
  isLoading?: boolean;
  acceptRequired?: boolean
}
const PrivatePolicyModal: FC<PrivatePolicyModalProps> = ({
  isOpen,
  onClose,
  setupdated,
  isLoading: loadingButton,
  handleModal,
  acceptRequired
}) => {
  const t2 = useTranslations("termAndConditions");
  const [accepted, setAccepted] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);

  const modalContentRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const modalContent = modalContentRef.current;
    if (!modalContent) return;

    const isScrolledToBottom =
      modalContent.scrollHeight - modalContent.scrollTop ===
      modalContent.clientHeight;

    setShowCheckbox(isScrolledToBottom);
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className='text-white flex flex-col gap-1'>
          {t2("title")}
          <span className='text-[14px] font-medium'>{t2("effectiveDate")}</span>
        </ModalHeader>
        <ModalBody>
          <div
            ref={modalContentRef}
            className='overflow-y-scroll flex-col shadow-md bg-gray-800 rounded-xl py-4  h-[375px] px-4'
            onScroll={handleScroll}
          >
            <h2 className='font-bold mb-4'> {t2("introductionTitle")}</h2>
            <p>{t2("introductionText")}</p>

            <p className='mb-4'>{t2("introductionText1")}</p>
            <h2 className='font-bold mb-4'>{t2("refundsTitle")}</h2>
            <p className='mb-4'>{t2("refundsText")}</p>
            <p className='mb-8'>{t2("refundsText1")}</p>

            <p className='mb-2 text-[22px] font-bold'>{t2("companyName")}</p>
            <p className='mb-2'>{t2("companyCif")}</p>
            <p className='mb-2'>{t2("companyAddress")}</p>
            <p className='mb-2'>{t2("companyContact")}</p>
            <p className='mb-2'>{t2("companyMail")}</p>
          </div>
          
          {acceptRequired ? 
          showCheckbox && (
            <div className='flex items-center mb-4'>
              <input
                type='checkbox'
                id='acceptTerms'
                className='mr-2'
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
              />
              <label htmlFor='acceptTerms'>{t2("acceptConditionsCheck")}</label>
            </div>
          ): ''}
        </ModalBody>
        <ModalFooter>
          {acceptRequired ? <Button
            size='lg'
            color={"success"}
            onClick={handleModal}
            isLoading={loadingButton}
            isDisabled={!accepted || !showCheckbox}
          >
            {t2("continueCta")}
          </Button> : ''}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PrivatePolicyModal;
