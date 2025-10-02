/* eslint-disable react-hooks/exhaustive-deps */
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";

import ServicesModal from "@/components/modal/ServicesModal";
import { Company } from "@/interfaces/auth";
import { INewBooking } from "@/interfaces/booking";
import { IActionResp, IPHours, IParking } from "@/interfaces/globalContext";
import boookingService from "@/services/booking.service";
import companyService from "@/services/company.service";
import { RootState } from "@/store";
import { refreshCompany } from "@/store/auth/authSlice";
import { capitalize } from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { differenceInHours } from "date-fns";
import { DateTime } from "luxon";
import { usePathname, useRouter } from "next/navigation";

import { FC, useEffect, useMemo, useState } from "react";
import { TiInfoLarge } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";

const sx = {
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.6)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.23) !important",
  },
  "& .MuiOutlinedInput-input": {
    color: "#fff",
  },
  // borderColor: 'rgba(255,255,255,0.87) !important',
} as const;

const icon = 15;

interface CreateBookingModalProps {
  isOpen: boolean;
  parking: IParking;
  onClose: () => void;
}

const CreateBookingModal: FC<CreateBookingModalProps> = ({
  isOpen,
  parking,
  onClose,
}) => {
  const t = useTranslations("App");
  const t4 = useTranslations("bookingTable");
  const t5 = useTranslations("createBooking");
  const today = new Date();
  const today2 = new Date();
  const currentHour = today.getHours();
  const newHour = currentHour + 1;
  const newHour2 = currentHour + 2;
  today.setHours(newHour);
  today2.setHours(newHour2);
  const { create } = boookingService;
  const { user } = useSelector((state: RootState) => state.auth);

  const router = useRouter();
  const pathname = usePathname();

  //refresh company
  const dispatch = useDispatch();
  const role = getCookie("role");

  //payload
  const [initDate, setInitDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(today2);
  const [licensePlate, setLicensePlate] = useState("");
  const [lpContainer, setLpContainer] = useState("");
  const [parkingId, setparkingId] = useState<string>(parking.id);
  const [parkingSelec, setParkingSel] = useState<IParking | null>(null);
  const [description, setDescription] = useState<string>("");
  // const [hours, setHours] = useState<IPHours[]>();
  const [hourSelect, setHourSelect] = useState<IPHours | null>(null);
  const [bHours, setBHours] = useState<number>(0);
  //   const [amountHours, setAmountHours] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  //ui values
  const [isLoading, setisLoading] = useState(false);
  const [showError, setShowError] = useState<Error>();
  const [respUpdate, setrespUpdate] = useState<IActionResp | null>(null);
  const [disabledButton, setdisabledButton] = useState(true);
  const [servModal, setservModal] = useState(false);

  const handleSubmit = async () => {
    const { id } = user!.info as Company;
    const initTime = DateTime.fromJSDate(initDate!).toUnixInteger();
    const endTime = DateTime.fromJSDate(endDate!).toUnixInteger();
    const payload: INewBooking = {
      initTime,
      companyId: id,
      description,
      licensePlate,
      lpContainer,
      parkingId: parkingId!,
      hours: hourSelect!.hours!,
    };
    try {
      const resp = await create(payload);

      if (role === "company" && user) {
        const { id } = user.info;
        const resCompany = await companyService.get(id);
        dispatch(refreshCompany(resCompany));
      }
      setrespUpdate(resp);
      setisLoading(false);
      setTimeout(() => {
        const languagePrefix = pathname.split("/")[1];
        const newPath = `/${languagePrefix}/company/booking/viewlist`;
        onClose();
        clearData();
        router.push(newPath);
      }, 1500);
    } catch (error) {
      setrespUpdate(null);
      setShowError(error as Error);
      setisLoading(false);
    }
  };

  const clearData = () => {
    setInitDate(today);
    setEndDate(today);
    setLicensePlate("");
    setLpContainer("");
    setparkingId("");
    setDescription("");
  };

  const handleDisable = () => {
    const cond: boolean =
      initDate === null ||
      hourSelect === null ||
      licensePlate === "" ||
      lpContainer === "" ||
      parkingId === "";
    setdisabledButton(cond);
  };

  const handleViewServices = (id: string) => {
    const park = Array(parking).find((p) => p.id == id);
    if (park) {
      setParkingSel(park);
      setservModal(true);
      return;
    }
    setservModal(false);
  };

  useMemo(
    () => handleDisable(),
    [initDate, endDate, licensePlate, lpContainer, parkingId]
  );

  useEffect(() => {
    setHourSelect(null);
  }, [parking, parkingId]);

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="text-white flex flex-col gap-1 text-3xl text-center">
          {capitalize(t5("title"))}
          <div className="">
            <h4 className="text-md lg:text-xl mt-2 text-gray-300">
              {parking.name}
            </h4>
            <h4 className="text-md lg:text-xl mt-2 text-gray-300">
              {t5("subtitle")}
            </h4>
            <Tooltip content={capitalize(t("viewservices"))}>
              <Button
                className="w-8 px-0 min-w-0 min-h-0 h-8"
                onPress={() => handleViewServices(parking.id)}
                color="secondary"
              >
                <TiInfoLarge size={icon} />
              </Button>
            </Tooltip>
          </div>
        </ModalHeader>
        <ModalBody className="w-full flex flex-col overflow-visible items-center justify-center p-8 gap-4">
          {/* <Card className="w-full lg:w-[800px] flex flex-col overflow-visible items-center justify-center p-8 gap-4"> */}
          {/* Fechas */}
          <div className="grid grid-cols-2  gap-y-5  gap-3 lg:gap-5 lg:text-end text-center items-center w-full lg:max-w-[80%]">
            <MobileDateTimePicker
              className="col-span-2"
              disablePast
              label={capitalize(t5("checkin"))}
              value={initDate}
              format="dd/MMM/yyyy hh:mm aa"
              views={["day", "month", "year", "hours", "minutes"]}
              onChange={(date) => setInitDate(date)}
              sx={sx}
            />
            <Select
              label={capitalize(t4("hours"))}
              items={parking.hours}
              value={`${hourSelect?.hours || ""}`}
              onChange={(e) => {
                console.log(e.target);
                const h = parking.hours.find(
                  (i) => i.hours == Number(e.target.value)
                );
                setHourSelect(h ? h : null);
                setBHours(Number(e.target.value));
              }}
              isRequired
              className="max-w-[100%]"
            >
              {(item) => (
                <SelectItem
                  key={item.hours}
                  value={item.hours}
                  className="text-white"
                >
                  {item?.hours?.toString()}
                </SelectItem>
              )}
            </Select>
            {/* <Input
              label={capitalize(t5("houramount"))}
              type="string"
              isRequired
              value={
                amountHours > 0
                  ? `${amountHours}`
                  : capitalize(t5("houramount"))
              }
              onChange={(e) => setAmountHours(Number(e.target.value))}
              disabled
            /> */}
            <div className="w-full flex flex-col justify-center items-center">
              <Chip className="m-0 p-5">
                {hourSelect != null
                  ? `${hourSelect.price.toFixed(2)}€ `
                  : capitalize(t5("price"))}
              </Chip>
            </div>
            {/* <Input
              label={capitalize(t5("price"))}
              type="string"
              value={
                hourSelect != null
                  ? `${hourSelect.price.toFixed(2)}€ `
                  : capitalize(t5("price"))
              }
              disabled
            /> */}
            <Input
              label={capitalize(t5("licensePlate"))}
              isRequired
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
            />
            <Input
              label={capitalize(t5("containerLicensePlate"))}
              isRequired
              value={lpContainer}
              onChange={(e) => setLpContainer(e.target.value.toUpperCase())}
            />
            <Input
              label={capitalize(t5("desc"))}
              className="col-span-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="col-span-2 mx-auto w-full text-center">
              <Popover
                isOpen={respUpdate !== null || showError !== undefined}
                color={
                  !showError
                    ? !respUpdate
                      ? "default"
                      : respUpdate.ok
                      ? "success"
                      : "danger"
                    : "danger"
                }
                placement="top"
                onOpenChange={(open) => {
                  setrespUpdate(null);
                  setShowError(undefined);
                }}
              >
                <PopoverTrigger>
                  <Button
                    isLoading={isLoading}
                    isDisabled={disabledButton}
                    size="lg"
                    color="success"
                    className="col-span-2 mx-auto w-full lg:max-w-[30%]"
                    onClick={handleSubmit}
                  >
                    {capitalize(t5("create"))}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">
                      {showError
                        ? capitalize(showError.message)
                        : respUpdate
                        ? capitalize(respUpdate.ok ? t5("successfull") : "")
                        : undefined}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <ServicesModal
            isOpen={servModal}
            onClose={() => setservModal(false)}
            services={parkingSelec ? parkingSelec.services : null}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateBookingModal;
