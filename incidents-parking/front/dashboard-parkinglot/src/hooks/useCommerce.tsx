import boookingService from "@/services/booking.service";
import { useQuery } from "@tanstack/react-query";

export const useGetParkingListByIdCompany = (companyId: string) => {
  const { getAll } = boookingService;
  return useQuery({
    queryKey: ["getBookingList"],
    queryFn: () => getAll({ companyId }),
  });
};
