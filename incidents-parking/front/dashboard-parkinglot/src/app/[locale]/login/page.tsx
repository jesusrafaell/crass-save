"use client";
import SessionExpiredModal from "@/components/modal/SessionExpired";
import logo from "@/images/crash-saver-app-logo.png";
import { ITypeLogin } from "@/interfaces/auth";
import authService from "@/services/auth.service";
import { loginSuccess } from "@/store/auth/authSlice";
import { capitalize, duration } from "@mui/material";
import {
  Button,
  Card,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { setCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface InputDto {
  value: string;
  error: boolean;
}

const testDataMail = {
  value: "",
  error: false,
};
const testDataPW = {
  value: "",
  error: false,
};

const Login: FC = () => {
  const t = useTranslations("App");
  const { push } = useRouter();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const tabIn: ITypeLogin = searchParams.get("type") as ITypeLogin;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [email, setEmail] = useState<InputDto>(testDataMail);
  const [password, setPassword] = useState<InputDto>(testDataPW);
  const [showError, setShowError] = useState<Error>();
  const [tab, setTab] = useState<ITypeLogin>(tabIn ? tabIn : "company");
  const [isLoading, setisLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const stopZIndex = () => {
    if (cardRef.current) {
      const children = cardRef.current.children;
      gsap.to([...children], {
        duration: 0.8,
        z: 0,
        stagger: -0.15,
      });
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "email") {
      const value = e.target.value;
      setEmail({ value: value.trim(), error: !validateEmail(value) });
    } else if (e.target.name === "password") {
      const value = e.target.value;
      setPassword({ value: value.trim(), error: !value.length });
    }
  };

  const handleLogin = async () => {
    // stopAnim(0);
    setisLoading(true);
    try {
      const userData = await authService.login(
        email.value,
        password.value,
        tab.toLowerCase() as ITypeLogin
      );
      stopZIndex();
      console.log("ueue");
      dispatch(loginSuccess(userData));

      // const { token } = userData;
      setCookie("token", "");
      setCookie("role", tab?.toLowerCase());
      push(`/${tab.toLowerCase()}`);
    } catch (error) {
      const _error = error as Error;
      // console.log('error handleLogin', _error.cause, _error.message, _error.name);
      setShowError(_error);
      setisLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };

  const formInput = () => {
    return (
      <form className="flex flex-col items-center content-center gap-4">
        <Input
          value={email.value}
          onChange={handleInputChange}
          isRequired
          type="email"
          name="email"
          isInvalid={email.error}
          errorMessage={email.error && t("errorMail")}
          label="E-mail"
          className="max-w-xs"
        />
        <Input
          value={password.value}
          isInvalid={password.error}
          errorMessage={password.error && t("errorPassword")}
          onChange={handleInputChange}
          isRequired
          type={isVisible ? "text" : "password"}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <FaEye className="text-xl text-default-400 pointer-events-none" />
              ) : (
                <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          name="password"
          label={capitalize(t("password"))}
          className="max-w-xs"
        />
        <Popover
          isOpen={showError !== undefined}
          color="danger"
          placement="top"
          onOpenChange={(open) => setShowError(undefined)}
        >
          <PopoverTrigger>
            <Button
              ref={buttonRef}
              color="primary"
              onClick={handleLogin}
              isLoading={isLoading}
            >
              {capitalize(t("login"))}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">{showError?.message}</div>
            </div>
          </PopoverContent>
        </Popover>
      </form>
    );
  };

  const changeQueryParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // const playAnim = ({ clientX, clientY }: React.MouseEvent<HTMLDivElement>) => {
  //   if (!isLoading) {
  //     const width = window.innerWidth;
  //     const height = window.innerHeight;
  //     const x = (clientX / width - 0.5) * 20;
  //     const y = (clientY / height - 0.5) * 20;
  //     gsap.to(cardRef.current, {
  //       duration: 0.5,
  //       overwrite: true,
  //       rotateX: -y,
  //       rotateY: x,
  //     });
  //   }
  // };

  // const stopAnim = (delay: number = 0.5) => {
  //   gsap.to(cardRef.current, {
  //     duration: 1,
  //     delay,
  //     rotateX: 0,
  //     rotateY: 0,
  //     overwrite: "auto",
  //   });
  // };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (buttonRef.current) buttonRef.current.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (cardRef.current) {
      const children = cardRef.current.children;
      gsap.set([...children], {
        z: 40,
        opacity: 1,
      });
      gsap.set(imgRef.current, {
        z: 50,
        opacity: 1,
      });
    }
    //eslint-disable-next-line
  }, [tab]);

  // useGSAP(
  //   () => {
  //     const tl = gsap.timeline();
  //     const children = cardRef.current ? cardRef.current.children : [];
  //     tl.fromTo(
  //       cardRef.current,
  //       {
  //         rotateY: 90,
  //       },
  //       {
  //         duration: 1.2,
  //         rotateY: 0,
  //         ease: "back.inOut(2)",
  //       },
  //       "start"
  //     )
  //       .fromTo(
  //         [...children],
  //         {
  //           z: 0,
  //           opacity: 0,
  //         },
  //         {
  //           duration: 0.3,
  //           z: 40,
  //           opacity: 1,
  //         },
  //         "start"
  //       )
  //       .fromTo(
  //         imgRef.current,
  //         {
  //           z: 0,
  //           opacity: 0,
  //         },
  //         {
  //           duration: 0.3,
  //           z: 50,
  //           opacity: 1,
  //         },
  //         "start"
  //       );
  //   },
  //   { scope: containerRef }
  // );

  return (
    <>
      <LoginStyled
        ref={containerRef}
        // onMouseMove={playAnim}
        // onMouseLeave={() => stopAnim()}
        className="w-screen h-screen lg:p-16 p-8 flex flex-col items-center justify-center"
      >
        <Card
          ref={cardRef}
          id="login-card"
          // onMouseEnter={() => stopAnim()}
          className="w-full lg:max-w-md p-3 flex flex-col items-center justify-center"
        >
          <Image
            src={logo}
            alt="Logo"
            width={100}
            height={100}
            className="pb-2"
            ref={imgRef}
          />
          <h1 className="mb-2 text-2xl">Parking Dashboard</h1>
          <span className="text-gray-300">{t("loginDirection")}: </span>
          <Tabs
            selectedKey={tab}
            onSelectionChange={(v) => {
              router.push(
                pathname + "?" + changeQueryParams("type", v.toString())
              );
              setTab(v.toString() as ITypeLogin);
            }}
            className="self-center"
            variant="underlined"
            aria-label="Tabs to enter system"
          >
            <Tab
              className="w-full"
              key="parking"
              title={capitalize(t("parkingMode"))}
            >
              {formInput()}
            </Tab>
            <Tab
              className="w-full"
              key="company"
              title={capitalize(t("companyMode"))}
            >
              {formInput()}
            </Tab>
          </Tabs>
        </Card>
      </LoginStyled>
      <SessionExpiredModal />
    </>
  );
};

const LoginStyled = styled.div`
  position: relative;
  transform-style: preserve-3d;
  perspective: 1400px;
  background-color: #fff;
  overflow: hidden;
  z-index: 1;
  .card {
    transform-style: preserve-3d;
    overflow: visible;
    backface-visibility: hidden;
    transition: none;
    > * {
      backface-visibility: hidden;
    }

    input {
      transition: all 0s 5000000s;
    }
  }
`;

export default Login;
