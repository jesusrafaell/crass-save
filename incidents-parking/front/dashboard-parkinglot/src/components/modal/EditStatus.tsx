"use client";

import GlobalContext from "@/context/Global";
import { IBooking } from "@/interfaces/booking";
import { IActionResp, IStatus } from "@/interfaces/globalContext";
import { capitalize } from "@mui/material";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import ModalUI from "./ModalUI";

interface Props {
  isOpen: boolean;
  setupdated: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  selectedBooking: IBooking | null;
  isDelete?: boolean;
}
const EditStatus: FC<Props> = ({
  isOpen,
  onClose,
  selectedBooking,
  setupdated,
  isDelete,
}) => {
  const t = useTranslations("App");
  const t2 = useTranslations("App.Modals");
  const t3 = useTranslations("App.SideBar");
  const { status, putBookingStatus, cancelBooking } = useContext(GlobalContext);
  const [statusFiltered, setstatusFiltered] = useState<IStatus[]>(
    status.filter((v) => v.type)
  );
  const [respUpdate, setrespUpdate] = useState<IActionResp | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const [statusUpdate, setstatusUpdate] = useState<IStatus | null>(null);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const statusSelected = statusFiltered.find((s) => s.id === value);
    setstatusUpdate(statusSelected ? statusSelected : null);
  };

  const handleUpdateStatus = async () => {
    setisLoading(true);
    if (!statusUpdate) return;
    if (!selectedBooking) return;
    try {
      const bookingId = selectedBooking?.id;
      const statusId = statusUpdate?.id;
      const resp = await putBookingStatus(bookingId, statusId);
      setrespUpdate(resp);
      setisLoading(false);
      setupdated(true);
      if (resp && resp.ok) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      setupdated(false);
      setisLoading(false);
      console.log("error handleUpdateStatus", error);
    }
  };

  const handleCancelBooking = async () => {
    setisLoading(true);
    if (!selectedBooking) return;
    try {
      const bookingId = selectedBooking?.id;
      const resp = await cancelBooking(bookingId);
      setrespUpdate(resp);
      setisLoading(false);
      setupdated(true);
      if (resp && resp.ok) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      setupdated(false);
      setisLoading(false);
      console.log("error handleCancelBooking", error);
    }
  };

  useMemo(() => {
    if (isDelete) {
      setstatusFiltered(status.filter((v) => v.type && v.key === "cancelled"));
      return;
    }
    setstatusFiltered(status.filter((v) => v.type && v.key !== "cancelled"));
  }, [status, isDelete]);

  if (!selectedBooking) return;

  return (
    <ModalUI
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
      title={`${
        isDelete
          ? t2.rich("deletebooking", { text: t3("booking") })
          : t2.rich("changestatus", { text: t3("booking") })
      }`}
    >
      <div className="dark flex flex-col gap-4 items-center justify-center">
        <Select
          label={capitalize(t("status"))}
          isRequired
          onChange={handleChange}
        >
          {statusFiltered.map((status) => (
            <SelectItem key={status.id} value={status.id}>
              {capitalize(status.name)}
            </SelectItem>
          ))}
        </Select>
        <Popover
          isOpen={respUpdate !== null}
          color={!respUpdate ? "default" : respUpdate.ok ? "success" : "danger"}
          placement="top"
          onOpenChange={(open) => {
            setrespUpdate(null);
          }}
        >
          <PopoverTrigger>
            <Button
              size="lg"
              color={isDelete ? "danger" : "success"}
              onClick={isDelete ? handleCancelBooking : handleUpdateStatus}
              isLoading={isLoading}
            >
              {capitalize(t("update"))}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">{respUpdate?.message}</div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </ModalUI>
  );
};

export default EditStatus;
