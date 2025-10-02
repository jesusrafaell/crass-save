import companyService from "@/services/company.service";
import { useQuery } from "@tanstack/react-query";

export const useGetCompanyData = (id: string) =>
  useQuery({
    queryKey: ["getCompanyData"],
    queryFn: () => companyService.get(id),
    refetchInterval: 60000,
  });
