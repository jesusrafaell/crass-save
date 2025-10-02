import { createSession, destroySession } from "@/app/actions";
import authService from "@/services/auth.service";
import themes from "@/utils/themes";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useLoginUser = () => {
  const router = useRouter();
  const message = useTranslations("Login");
  return useMutation({
    mutationFn: authService.login,
    mutationKey: ["LOGIN_USER"],
    onSuccess: async (data) => {
      // console.log('Data on success login hook', data);
      await createSession(data);
      router.push(`/dashboard`);
      toast.success(
        message.rich("welcome", {
          name: `${data.user.firstName} ${data.user.lastName} \n ${data.company.name}`,
        }),
        {
          style: {
            background: themes.light.colors.primary,
          },
        }
      );
    },
    onError: (error) => {
      // console.log('error in mutation login', error);
      toast.error(error?.message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const message = useTranslations("Login");
  return useMutation({
    mutationFn: destroySession,
    mutationKey: ["LOGOUT_USER"],
    onSuccess: async () => {
      toast.info(message("goodbye"), {
        style: {
          background: themes.light.colors.primary,
        },
      });
      router.push(`/login`);
    },
  });
};
