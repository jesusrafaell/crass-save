"use client";

import { ILoginPayload } from "@/models";

import { useLoginUser } from "@/hooks/auth";
import { useLoginSchema } from "@/utils/validators/loginSchemaValidator";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Checkbox as UICheckbox,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@nextui-org/react";
import logo from "@/images/logo.png";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { HiEye, HiEyeOff } from "react-icons/hi";
import styled from "styled-components";
import Image from "next/image";
interface ILoginFormProps {
  locale: string;
}

function LoginForm({ locale }: ILoginFormProps) {
  const t = useTranslations("Login");
  const [isVisible, setisVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, seterrors] = useState<Error>();
  const {
    handleSubmit,

    control,

    formState: { errors },
  } = useForm<ILoginPayload>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(useLoginSchema()),
  });

  const toggleVisibility = () => setisVisible(!isVisible);

  //Login
  const { mutateAsync: loginUserFn /*isPending: isLoadingLogin */ } =
    useLoginUser();

  const onSubmit: SubmitHandler<ILoginPayload> = async (data) => {
    try {
      setIsLoading(true);
      await loginUserFn(data);
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <LoginFormStyled>
      <div className="login-wrapper">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div className="flex justify-center -mt-20">
            <Image src={logo} alt="myappssistance" width={200} />
          </div>
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight">
            {t("title")}
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-6"
          >
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  label={t("email")}
                  color={errors.password ? "danger" : "default"}
                  errorMessage={errors.email?.message}
                  variant="faded"
                  className="bg-[#fff]"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, ref } }) => (
                <Input
                  ref={ref}
                  onChange={onChange}
                  label={t("password")}
                  color={errors.password ? "danger" : "default"}
                  errorMessage={errors.password?.message}
                  variant="faded"
                  endContent={
                    <button
                      className="p-0 min-w-0 min-h-0 focus:outline-none self-center"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <HiEyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <HiEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                />
              )}
            />

            <div className="flex items-center justify-center">
              <div className="flex items-start">
                <Checkbox type="checkbox">{t("remember")}</Checkbox>
              </div>
            </div>
            <Popover
              isOpen={!!false}
              onOpenChange={(open) => undefined}
              color="danger"
            >
              <PopoverTrigger>
                <Button
                  className="bg-[#5649ff] w-full text-[#fff] py-[25px]"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Spinner size="sm" style={{ background: "transparent" }} />
                  )}
                  {t("login")}
                </Button>
              </PopoverTrigger>
              <PopoverContent>{"algo"}</PopoverContent>
            </Popover>
          </form>
        </div>
      </div>
    </LoginFormStyled>
  );
}

const Checkbox = styled(UICheckbox)`
  span:nth-of-type(2) {
    &::after {
      background-color: #5649ff !important;
    }
  }
`;

const LoginFormStyled = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  background-color: #fff;
  color: #000;
  height: 100vh;
  .login-wrapper {
    width: 100%;
    max-width: 450px;
    border-radius: 14px;
  }
  form div:not(button div) {
    background-color: #fff;
    outline: none;
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px white inset !important;
    }
  }
`;

export default LoginForm;
