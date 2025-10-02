import { Service } from "@/interfaces/booking";
import { capitalize } from "@mui/material";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { FaRegLightbulb, FaTrailer } from "react-icons/fa";
import { FaRoadBarrier } from "react-icons/fa6";
import { GrUserPolice } from "react-icons/gr";
import {
  IoIosBed,
  IoIosRestaurant,
  IoIosSnow,
  IoIosWifi,
  IoMdVideocam,
} from "react-icons/io";
import { IoBatteryCharging, IoWarningOutline } from "react-icons/io5";
import { LuParkingCircle } from "react-icons/lu";
import { MdFence } from "react-icons/md";
import { PiShowerFill, PiToiletFill } from "react-icons/pi";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";

interface ServicesModalProps {
  isOpen: boolean;
  services: Service[] | null;
  onClose: () => void;
}
const icon = 40;
const serviceIcons: { [key: number]: JSX.Element } = {
  1: <FaRoadBarrier size={icon} />,
  2: <MdFence size={icon} />,
  3: <FaRegLightbulb size={icon} />,
  4: <IoMdVideocam size={icon} />,
  5: <GrUserPolice size={icon} />,
  6: <PiToiletFill size={icon} />,
  7: <PiShowerFill size={icon} />,
  8: <IoIosWifi size={icon} />,
  9: <IoIosSnow size={icon} />,
  10: <IoBatteryCharging size={icon} />,
  11: <IoWarningOutline size={icon} />,
  12: <LuParkingCircle size={icon} />,
  13: <FaTrailer size={icon} />,
  14: <IoIosBed size={icon} />,
  15: <IoIosRestaurant size={icon} />,
};

const ServicesModal: FC<ServicesModalProps> = ({
  isOpen,
  services,
  onClose,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const t = useTranslations("App");

  const GridContainer = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: ${isMobile ? "repeat(4, 1fr)" : "repeat(8, 1fr)"};
    gap: 1rem;
  `;
  if (services === null) return;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-3xl text-center">
          {capitalize(t("services"))}
        </ModalHeader>
        <ModalBody>
          <GridContainer>
            {services.map((service) => {
              const ServiceIcon = serviceIcons[service.key];
              if (!ServiceIcon) return null;
              return (
                <Tooltip
                  key={service.id}
                  content={service.name}
                  className="z-[100] text-gray-200"
                >
                  <div className="w-fit">{ServiceIcon}</div>
                </Tooltip>
              );
            })}
          </GridContainer>
        </ModalBody>
        <ModalFooter>
          {/* <Button color='danger' variant='light' onPress={onClose}>
						Cerrar
					</Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ServicesModal;
