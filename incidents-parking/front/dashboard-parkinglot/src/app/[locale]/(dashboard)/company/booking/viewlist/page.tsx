/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import AsignDriver from "@/components/modal/AsignDriver";
import EditStatus from "@/components/modal/EditStatus";
import ServicesModal from "@/components/modal/ServicesModal";
import TableBookings from "@/components/tables/TableBookings";
import GlobalContext from "@/context/Global";
import { Company } from "@/interfaces/auth";
import { IBooking } from "@/interfaces/booking";
import { IActionResp } from "@/interfaces/globalContext";
import boookingService from "@/services/booking.service";
import { RootState } from "@/store";
import {
  Button,
  Card,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { FC, useContext, useLayoutEffect, useMemo, useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";

const BookingTable: FC = () => {
  const t4 = useTranslations("bookingTable");
  const { user } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [servModal, setservModal] = useState(false);
  const [editModal, seteditModal] = useState(false);
  const [asignModal, setasignModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [statusUpdated, setstatusUpdated] = useState(false);
  // const [deleteModal, setdeleteModal] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [cancel, SetCancel] = useState<IActionResp | null>(null);

  const { cancelBooking } = useContext(GlobalContext);

  const fetchBookings = async (all = false) => {
    if (!user) return;
    setisLoading(true);
    const { id } = user.info as Company;
    try {
      const data = await boookingService.getAll({ companyId: id, all: all });
      setBookings(data);
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      const _error = error as AxiosError<{ error: string }>;
    }
  };

  const handleViewServices = (id: string) => {
    const selectedBooking = bookings.find((booking) => booking.id === id);
    if (selectedBooking) {
      setSelectedBooking(selectedBooking);
      setservModal(true);
      return;
    }
    setservModal(false);
  };

  const handleAsign = (id: string) => {
    const selectedBooking = bookings.find((booking) => booking.id === id);
    if (selectedBooking) {
      setSelectedBooking(selectedBooking);
      setasignModal(true);
      return;
    }
    setasignModal(false);
  };

  const handleEdit = (id: string) => {
    const selectedBooking = bookings.find((booking) => booking.id === id);
    if (selectedBooking) {
      setSelectedBooking(selectedBooking);
      seteditModal(true);
      return;
    }
    seteditModal(false);
  };

  const handleCancelBooking = async (id: string) => {
    // setisLoading(true);
    try {
      console.log(id);
      await cancelBooking(id);
      SetCancel({
        ok: true,
        message: "Cancelled",
      });
      await handleGetAll(false);
    } catch (err: any) {
      if (err?.message == "R010P") {
        SetCancel({
          ok: false,
          message: t4("bookingExpired"),
        });
      } else {
        SetCancel({
          ok: false,
          message: "Error",
        });
      }
    } finally {
      setTimeout(() => {
        // setisLoading(false);
        SetCancel(null);
      }, 3000);
    }
    // const selectedBooking = bookings.find((booking) => booking.id === id);
    // if (selectedBooking) {
    // setSelectedBooking(selectedBooking);
    // setdeleteModal(true);
    //   return;
    // }
    // setdeleteModal(false);
  };

  const onClose = () => {
    setservModal(false);
    setasignModal(false);
    seteditModal(false);
    // setdeleteModal(false);
    setSelectedBooking(null);
  };

  useMemo(async () => {
    if (statusUpdated) await fetchBookings();
  }, [statusUpdated]);
  useLayoutEffect(() => {
    fetchBookings();
  }, []);

  const handleGetAll = async (value: boolean) => {
    await fetchBookings(value);
    setViewAll(value);
  };

  return (
    <Card className="w-full h-full p-4 lg:p-8 overflow-auto min-h-[100vh] flex">
      <CardHeader className="text-4xl justify-between flex">
        <h1 className="text-4xl mx-auto">{t4("tabletitle")}</h1>
        <Popover
          isOpen={cancel !== null}
          color={!cancel ? "default" : cancel.ok ? "success" : "danger"}
          placement="bottom-end"
          onOpenChange={(open) => {
            SetCancel(null);
          }}
        >
          <PopoverTrigger>
            <Button
              className="p-2 ml-auto w-[100px]"
              color={viewAll ? "success" : "secondary"}
              onClick={() => handleGetAll(!viewAll)}
            >
              {!viewAll ? (
                <span className="flex justify-center items-center gap-2">
                  <FaList />
                  {t4("viewAll")}
                </span>
              ) : (
                <IoMdArrowRoundBack size="md" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">{cancel?.message}</div>
            </div>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <TableBookings
        bookings={bookings}
        isLoading={isLoading}
        handleAsign={handleAsign}
        handleDelete={handleCancelBooking}
        handleEdit={handleEdit}
        handleViewServices={handleViewServices}
        key={"tabla"}
      />
      <>
        <ServicesModal
          isOpen={servModal}
          onClose={onClose}
          services={selectedBooking ? selectedBooking.services : null}
        />
        <AsignDriver
          isOpen={asignModal}
          selectedBooking={selectedBooking}
          onClose={onClose}
          setupdated={setstatusUpdated}
        />
        <EditStatus
          isOpen={editModal}
          selectedBooking={selectedBooking}
          onClose={onClose}
          setupdated={setstatusUpdated}
        />
        {/* <EditStatus
          isOpen={deleteModal}
          isDelete
          selectedBooking={selectedBooking}
          onClose={onClose}
          setupdated={setstatusUpdated}
        /> */}
      </>
    </Card>
  );
};

export default BookingTable;
