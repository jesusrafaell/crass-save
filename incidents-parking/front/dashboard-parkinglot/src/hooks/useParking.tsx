import boookingService from "@/services/booking.service";
import { useQuery } from "@tanstack/react-query";

export const useGetParkingListById = (parkingId: string) => {
  const { getAll } = boookingService;
  return useQuery({
    queryKey: ["getBookingList"],
    queryFn: () => getAll({ parkingId }),
  });
};
