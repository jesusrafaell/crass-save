/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useGetAllRequest } from "@/hooks/requests";
import { IDisclosure, IDriverData, ILocation, IRequest } from "@/models";
import authService from "@/services/auth.service";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  User,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { FC, useEffect, useMemo, useState } from "react";
import { HiEye } from "react-icons/hi";

interface IModalService {
  disclosure: IDisclosure;
  payload?: ILocation;
}

const ModalService: FC<IModalService> = ({ payload, disclosure }) => {
  const t = useTranslations("Dashboard");
  const { isOpen, onOpenChange, onOpen, onClose } = disclosure;
  const { userID } = payload || {};
  const [dataDrivers, setdataDrivers] = useState<IRequest[]>([]);
  const [driver, setDriver] = useState<IDriverData | null>(null);
  useMemo(() => {
    if (userID) onOpen();
  }, [userID]);

  //debugging skeleton
  const [flag, setflag] = useState(true);
  const handleClick = () => setflag((prev) => !prev);

  const { mutateAsync: getAllRequest, isPending } = useGetAllRequest();

  const getData = async () => {
    if (!userID) return;
    try {
      const user = await authService.getDriver(userID);
      setDriver(user);
      // const data = await getAllRequest().then((val) =>
      //   val.filter((req) => {
      //     if (req.driver) return req.driver.id === userID;
      //     return false;
      //   })
      // );
      // if (!data.length) onClose();
      // console.log("userData", data);
    } catch (error) {
      onClose();
    }
  };

  useEffect(() => {
    getData();
  }, [userID]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      // size='xs'
      backdrop="opaque"
      classNames={{
        base: "p-0",
        body: "items-center",
        header: "self-center text-3xl",
      }}
    >
      <ModalContent>
        {(onClose) => {
          // if (flag)
          if (isPending)
            return (
              <>
                <ModalHeader className="gap-4">
                  <Skeleton className="rounded-full w-[56px] h-[56px]" />
                  <div className="flex flex-col gap-2 justify-center">
                    <Skeleton className="w-[153px] h-[24px]" />
                    <Skeleton className="w-[123px] h-[16px]" />
                  </div>
                </ModalHeader>
                <ModalBody className=" grid grid-cols-2">
                  <p className="capitalize col-span-2 text-center text-lg text-gray-700">
                    Towtruck Information
                  </p>
                  <Skeleton className="w-full h-[56px] rounded-medium" />
                  <Skeleton className="w-full h-[56px] rounded-medium" />
                  <Skeleton className="w-full h-[56px] rounded-medium" />
                  <Skeleton className="w-full h-[56px] rounded-medium" />
                  <Divider className="col-span-2" />
                  <p className="capitalize col-span-2 text-center text-lg text-gray-700">
                    User Information
                  </p>
                  <Skeleton className="w-full h-[56px] rounded-medium" />
                  <Skeleton className="w-full h-[56px] rounded-medium" />
                  <Skeleton className="w-full h-[56px] rounded-medium" />
                  <Skeleton className="w-full h-[56px] rounded-medium" />
                  <Divider className="col-span-2" />
                </ModalBody>
                <ModalFooter className="justify-center">
                  <Button
                    disabled
                    color="primary"
                    startContent={<HiEye />}
                    onPress={handleClick}
                  >
                    {t("viewmore")}
                  </Button>
                </ModalFooter>
              </>
            );
          if (driver != null)
            return (
              <>
                <ModalHeader>
                  <User
                    description={`Phone: ${driver.mobile}`}
                    classNames={{
                      name: "text-xl",
                      base: "gap-4",
                    }}
                    name={driver.firstName + " " + driver.lastName}
                    avatarProps={{
                      src: driver.towTruck.imagePath,
                      size: "lg",
                      color: "primary",
                      isBordered: true,
                    }}
                  />
                </ModalHeader>
                <ModalBody className=" grid grid-cols-2">
                  <p className="capitalize col-span-2 text-center text-lg text-gray-700">
                    User Information
                  </p>
                  <Input
                    disabled
                    label={"Full name"}
                    value={driver.firstName + " " + driver.lastName}
                  />
                  <Input disabled label={"Email"} value={`${driver.email}`} />
                  <Input disabled label={"Status"} value={driver.status.name} />
                  <Input
                    disabled
                    label={"Request"}
                    value={driver.reqId ? "Si" : "No"}
                    color={driver.reqId ? "success" : "primary"}
                  />
                  <Divider className="col-span-2" />
                  <p className="capitalize col-span-2 text-center text-lg text-gray-700">
                    Towtruck Information
                  </p>
                  <Input
                    disabled
                    label={"Color"}
                    value={driver.towTruck.color}
                  />
                  <Input
                    disabled
                    label={"License Plate"}
                    value={driver.towTruck.licensePlate}
                  />
                  <Input disabled label={"Make"} value={driver.towTruck.make} />
                  <Input
                    disabled
                    label={"year"}
                    value={`${driver.towTruck.year}`}
                  />
                  <Divider className="col-span-2" />
                </ModalBody>
                <ModalFooter className="justify-center">
                  {/* <Button
                    onPress={handleClick}
                    color="primary"
                    startContent={<HiEye />}
                  >
                    {t("viewmore")}
                  </Button> */}
                </ModalFooter>
              </>
            );
        }}
      </ModalContent>
    </Modal>
  );
};

export default ModalService;
