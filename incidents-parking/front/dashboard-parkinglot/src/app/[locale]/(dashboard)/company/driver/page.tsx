"use client";
import CreateModal from "@/components/modal/CreateDriver";
import TableDriver from "@/components/tables/TableDrivers";
import { Company } from "@/interfaces/auth";
import truckService from "@/services/truck.service";
import { RootState } from "@/store";
import {
  Button,
  Card,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSelector } from "react-redux";

interface IPopover {
  type: string;
  message: string;
}

const DriverPage = () => {
  const t2 = useTranslations("drivers");
  const [popover, setpopover] = useState<IPopover>();
  const [loading, setloading] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleCreateDriver = async (data: { [key: string]: string }) => {
    setloading(true);
    if (!user) return;
    const { id } = user.info as Company;
    try {
      const { email } = data;
      const resp = await truckService.addTruck(email, id);
      if (!resp.ok) return;
      setpopover({
        type: "success",
        message: resp.data.message,
      });
      setloading(false);
    } catch (error) {
      const err = error as Error;
      // console.log('err', err);
      setpopover({
        type: "error",
        message: err.message,
      });
      setloading(false);
    }
    handleCloseCreateModal();
  };

  return (
    <>
      <Card className="w-full h-full p-4 lg:p-8 overflow-auto min-h-[100vh]">
        <CardHeader className="text-4xl justify-between">
          <h1>{t2("title")}</h1>
          <Popover
            isOpen={popover !== undefined}
            color={
              !popover
                ? "default"
                : popover.type === "success"
                ? "success"
                : "danger"
            }
            placement="top"
            onOpenChange={(open) => setpopover(undefined)}
          >
            <PopoverTrigger>
              <Button
                size="md"
                color={"success"}
                onClick={handleOpenCreateModal}
                isLoading={loading}
              >
                {t2("register")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2">
                <div className="text-small font-bold">{popover?.message}</div>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <TableDriver />
      </Card>
      <CreateModal
        isOpen={isCreateModalOpen}
        isLoading={loading}
        onClose={handleCloseCreateModal}
        onCreate={handleCreateDriver}
        title={t2("modaltitle")}
        fields={[{ label: "E-mail", name: "email" }]}
      />
    </>
  );
};

export default DriverPage;
