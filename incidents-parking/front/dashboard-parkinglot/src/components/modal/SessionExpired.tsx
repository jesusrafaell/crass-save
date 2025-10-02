import { useDisclosure } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import ModalUI from "../modal/ModalUI";

import { capitalize } from "@mui/material";
import { useTranslations } from "next-intl";
import { useLayoutEffect } from "react";
import { GoAlert } from "react-icons/go";

function SessionExpiredModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const t2 = useTranslations("App.Modals");
  const router = useRouter();
  const searchParams = useSearchParams();
  useLayoutEffect(() => {
    const showModal = searchParams?.get("session") === "expired";
    // console.log('showModal', showModal);
    if (showModal) {
      onOpen();
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleClose = () => {
    router.replace("/login", {});
  };

  return (
    <ModalUI
      isOpen={isOpen}
      onClose={handleClose}
      onOpenChange={onOpenChange}
      title={""}
      size={"2xl"}
    >
      <div className="flex w-full pb-8">
        <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-yellow-300 p-5 text-[30px] text-orange-800">
          <GoAlert />
        </div>
        <div className="ml-4 flex flex-col gap-y-5">
          <h1 className="text-lg font-bold">
            {capitalize(t2("sessionexpired"))}
          </h1>
          <p className="text-sm">
            {capitalize(t2("sessionexpiredIndication"))}
          </p>
        </div>
      </div>
    </ModalUI>
  );
}

export default SessionExpiredModal;
