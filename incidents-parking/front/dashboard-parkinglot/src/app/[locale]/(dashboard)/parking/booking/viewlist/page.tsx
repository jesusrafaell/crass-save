/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import EditStatus from "@/components/modal/EditStatus";
import ServicesModal from "@/components/modal/ServicesModal";
import TableBookings from "@/components/tables/TableBookings";
import { Parking } from "@/interfaces/auth";
import { IBooking } from "@/interfaces/booking";
import boookingService from "@/services/booking.service";
import { RootState } from "@/store";
import { Card, CardHeader } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { FC, useLayoutEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const BookingTable: FC = () => {
  const t4 = useTranslations("bookingTable");
  const { user } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [servModal, setservModal] = useState(false);
  const [editModal, seteditModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [statusUpdated, setstatusUpdated] = useState(false);
  // const [deleteModal, setdeleteModal] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;
    setisLoading(true);
    const { id } = user.info as Parking;
    try {
      const data = await boookingService.getAll({ parkingId: id });
      setBookings(data);
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      const _error = error as Error;
      console.error("Error al obtener las reservas:", _error);
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

  const handleEdit = (id: string) => {
    const selectedBooking = bookings.find((booking) => booking.id === id);
    if (selectedBooking) {
      setSelectedBooking(selectedBooking);
      seteditModal(true);
      return;
    }
    seteditModal(false);
  };

  const handleDelete = (id: string) => {
    console.log(`Eliminar reserva con ID: ${id}`);
    const selectedBooking = bookings.find((booking) => booking.id === id);
    if (selectedBooking) {
      // setdeleteModal(true);
    }
  };

  const onClose = () => {
    setservModal(false);
    // setdeleteModal(false);
    seteditModal(false);
    setSelectedBooking(null);
  };

  useMemo(async () => {
    if (statusUpdated) await fetchBookings();
  }, [statusUpdated]);

  useLayoutEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Card className="w-full h-full p-4 lg:p-8 overflow-auto">
      <CardHeader className="text-4xl justify-center">
        <h1 className="text-4xl">{t4("tabletitle")}</h1>
      </CardHeader>
      <TableBookings
        bookings={bookings}
        isLoading={isLoading}
        handleDelete={handleDelete}
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
        <EditStatus
          isOpen={editModal}
          selectedBooking={selectedBooking}
          onClose={onClose}
          setupdated={setstatusUpdated}
        />
      </>
    </Card>
  );
};

export default BookingTable;
