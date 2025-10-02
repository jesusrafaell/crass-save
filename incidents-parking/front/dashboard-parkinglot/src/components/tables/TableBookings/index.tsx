"use client";

import React, { FC, useState, useMemo } from "react";
import { IBooking } from "@/interfaces/booking";
import { convertSectoDate } from "@/utils/reusableFunctions";
import { capitalize } from "@mui/material";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Pagination,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { PiSteeringWheel } from "react-icons/pi";
import { TiInfoLarge } from "react-icons/ti";
import { VscEdit, VscTrash } from "react-icons/vsc";

interface Props {
  bookings: IBooking[];
  isLoading: boolean;
  handleViewServices: (id: string) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleAsign?: (id: string) => void;
}

const icon = 20;

const TableBookings: FC<Props> = ({
  bookings,
  isLoading,
  handleViewServices,
  handleEdit,
  handleDelete,
  handleAsign,
}) => {
  const t = useTranslations("App");
  const t4 = useTranslations("bookingTable");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = useMemo(
    () => Math.ceil(bookings.length / rowsPerPage),
    [bookings, rowsPerPage]
  );

  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
    return bookings.slice(start, end);
  }, [page, rowsPerPage, bookings, totalPages]);

  return (
    <div className="flex flex-col min-h-[500px] h-[820px]">
      <div className="flex-grow h-[750px] overflow-x-auto">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner color="primary" label={`${capitalize(t("loading"))}...`} />
          </div>
        )}
        <Table
          removeWrapper
          classNames={{
            table: `w-full`,
            td: "text-center",
            th: "text-center",
          }}
        >
          <TableHeader>
            <TableColumn>{capitalize(t4("user"))}</TableColumn>
            <TableColumn>{capitalize(t4("checkin"))}</TableColumn>
            <TableColumn>{capitalize(t4("checkout"))}</TableColumn>
            <TableColumn>{capitalize(t4("hours"))}</TableColumn>
            <TableColumn>{capitalize(t4("licensePlate"))}</TableColumn>
            <TableColumn>{capitalize(t4("price"))}</TableColumn>
            <TableColumn>{capitalize(t4("parking"))}</TableColumn>
            <TableColumn>{capitalize(t4("status"))}</TableColumn>
            <TableColumn>{capitalize(t4("desc"))}</TableColumn>
            <TableColumn>{capitalize(t4("createdat"))}</TableColumn>
            <TableColumn>{capitalize(t4("services"))}</TableColumn>
            <TableColumn className="w-[100px]">
              {capitalize(t4("actions"))}
            </TableColumn>
          </TableHeader>
          <TableBody style={{ opacity: isLoading ? 0 : 1 }}>
            {paginatedBookings.map((value) => (
              <TableRow
                key={value.id}
                className="items-center hover:bg-default-100 cursor-pointer"
              >
                <TableCell className="p-1">{value.driverId}</TableCell>
                <TableCell className="p-1">
                  {convertSectoDate(value.initTime)}
                </TableCell>
                <TableCell className="p-1">
                  {convertSectoDate(value.endTime)}
                </TableCell>
                <TableCell className="p-1">{value.hours}</TableCell>
                <TableCell className="p-1">{value.licensePlate}</TableCell>
                <TableCell className="p-1">{value.price}</TableCell>
                <TableCell className="p-1">{value.parking.name}</TableCell>
                <TableCell className="p-1">
                  {capitalize(value.status.name)}
                </TableCell>
                <TableCell className="p-1">{value.description}</TableCell>
                <TableCell className="p-1">
                  {convertSectoDate(value.createdAt)}
                </TableCell>
                <TableCell className="p-1 w-fit">
                  <Tooltip
                    className="text-white"
                    content={capitalize(t("viewservices"))}
                  >
                    <Button
                      className="w-8 px-0 min-w-0"
                      onPress={() => handleViewServices(value.id)}
                      color="secondary"
                    >
                      <TiInfoLarge size={icon} />
                    </Button>
                  </Tooltip>
                </TableCell>
                <TableCell className="p-1 min-w-[100px]">
                  <div className="grid grid-cols-3 justify-items-center gap-2">
                    {value.driver === null && handleAsign !== undefined && (
                      <Tooltip
                        className="text-white"
                        content={capitalize(t4("driver"))}
                      >
                        <Button
                          className="w-8 px-0 min-w-0"
                          onPress={() => handleAsign!(value.id)}
                          color="secondary"
                        >
                          <PiSteeringWheel size={icon} />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip
                      className="text-white"
                      content={capitalize(t("edit"))}
                    >
                      <Button
                        className="w-8 px-0 min-w-0"
                        onPress={() => handleEdit(value.id)}
                        color="warning"
                      >
                        <VscEdit size={icon} />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      className="text-white"
                      content={capitalize(t("delete"))}
                    >
                      <Button
                        className="w-8 px-0 min-w-0"
                        onPress={() => handleDelete(value.id)}
                        color="danger"
                      >
                        <VscTrash size={icon} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-auto flex justify-between items-center pt-4">
        <Pagination
          showControls
          color="default"
          page={page}
          total={totalPages}
          onChange={setPage}
        />
        <div className="flex items-center text-default-400 text-small">
          {/* <span>Rows:</span> */}
          <select
            // className="bg-transparent outline-none ml-2"
            className="bg-default-100 text-gray-200 rounded-md p-1 ml-2"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TableBookings;
