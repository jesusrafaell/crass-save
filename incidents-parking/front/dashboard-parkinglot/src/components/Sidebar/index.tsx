"use client";
import GlobalContext from "@/context/Global";
import logo from "@/images/crash-saver-app-logo.png";
import { Company } from "@/interfaces/auth";
import { RootState } from "@/store";
import { logoutUser } from "@/store/auth/authSlice";
import { localesConfig } from "@/utils/localesConfig";
import authService from "@/services/auth.service";
import { capitalize } from "@mui/material";
import { Button } from "@nextui-org/react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { BsCurrencyEuro } from "react-icons/bs";
import { FaEuroSign, FaQuestion, FaTruck } from "react-icons/fa";
import { HiLanguage } from "react-icons/hi2";
import {
  VscAdd,
  VscArrowLeft,
  VscBook,
  VscCalendar,
  VscCircleFilled,
  VscSignOut,
} from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import SidebarLinkGroup from "./SidebarLinkGroup";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  let type = getCookie("role");
  const t = useTranslations("App");
  const t2 = useTranslations("App.SideBar");
  const { user: userContent } = useSelector((state: RootState) => state.auth);
  const { showBalance } = useContext(GlobalContext);
  const pathname = usePathname();
  const router = useRouter();
  const role = getCookie("role");
  const dispatch = useDispatch();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const handleChangeLocale = async (locale: string) => {
    setCookie("NEXT_LOCALE", locale);
    const [, base, ...resto] = pathname.split("/");
    router.replace(`/${locale}/` + `${resto.join("/")}`);
    router.refresh();
  };

  const commerceGroup = (
    <>
      <SidebarLinkGroup
        activeCondition={pathname === "/" || pathname.includes("booking")}
      >
        {(handleClick, open) => {
          return (
            <>
              <Link
                href="#"
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  (pathname === "/" || pathname.includes("dashboard")) &&
                  "bg-graydark dark:bg-meta-4"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                }}
              >
                <VscCalendar className="w-[20px] h-[20px]" />
                {capitalize(t2("booking"))}
                <svg
                  className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                    open && "rotate-180"
                  }`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                    fill=""
                  />
                </svg>
              </Link>

              <div
                className={`translate transform overflow-hidden ${
                  !open && "hidden"
                }`}
              >
                <ul className="flex flex-col pl-6">
                  <Link
                    href="/company/booking/create"
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes("booking") &&
                      "bg-graydark dark:bg-meta-4"
                    }`}
                  >
                    <VscAdd className="w-4 h-4" />
                    {capitalize(t2("create"))}
                  </Link>
                  <Link
                    href="/company/booking/viewlist"
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes("booking") &&
                      "bg-graydark dark:bg-meta-4"
                    }`}
                  >
                    <VscBook className="w-4 h-4" />
                    {capitalize(t2("all"))}
                  </Link>
                </ul>
              </div>
            </>
          );
        }}
      </SidebarLinkGroup>
      <SidebarLinkGroup
        activeCondition={pathname === "/" || pathname.includes("credits")}
      >
        {(handleClick, open) => {
          return (
            <>
              <Link
                href="#"
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  (pathname === "/" || pathname.includes("credits")) &&
                  "bg-graydark dark:bg-meta-4"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                }}
              >
                <BsCurrencyEuro className="w-[20px] h-[20px]" />
                {capitalize(t2("credits"))}
                <svg
                  className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                    open && "rotate-180"
                  }`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                    fill=""
                  />
                </svg>
              </Link>

              <div
                className={`translate transform overflow-hidden ${
                  !open && "hidden"
                }`}
              >
                <ul className="flex flex-col pl-6">
                  <Link
                    href="/credits/buy"
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes("booking") &&
                      "bg-graydark dark:bg-meta-4"
                    }`}
                  >
                    <VscAdd className="w-4 h-4" />
                    {capitalize(t2("purchase"))}
                  </Link>
                </ul>
              </div>
            </>
          );
        }}
      </SidebarLinkGroup>
      <SidebarLinkGroup
        activeCondition={pathname === "/" || pathname.includes("driver")}
      >
        {(handleClick, open) => {
          return (
            <>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                }}
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  (pathname === "/" || pathname.includes("credits")) &&
                  "bg-graydark dark:bg-meta-4"
                }`}
              >
                <FaTruck />
                {capitalize(t2("driver"))}
                <svg
                  className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                    open && "rotate-180"
                  }`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                    fill=""
                  />
                </svg>
              </Link>

              <div
                className={`translate transform overflow-hidden ${
                  !open && "hidden"
                }`}
              >
                <ul className="flex flex-col pl-6">
                  {/* <Link
										href='/company/driver/create'
										onClick={() => setSidebarOpen(false)}
										className={
											`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
												pathname.includes('driver') && 'bg-graydark dark:bg-meta-4'
											}`}>
										<VscAdd className='w-4 h-4'/>
										{capitalize(t2('create'))}
									</Link> */}
                  <Link
                    href="/company/driver"
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes("driver") &&
                      "bg-graydark dark:bg-meta-4"
                    }`}
                  >
                    <VscBook className="w-4 h-4" />
                    {capitalize(t2("all"))}
                  </Link>
                </ul>
              </div>
            </>
          );
        }}
      </SidebarLinkGroup>
    </>
  );

  const parkingGroup = (
    <SidebarLinkGroup
      activeCondition={pathname === "/" || pathname.includes("booking")}
    >
      {(handleClick, open) => {
        return (
          <>
            <Link
              href="#"
              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                (pathname === "/" || pathname.includes("dashboard")) &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
              }}
            >
              <VscCalendar className="w-[20px] h-[20px]" />
              {capitalize(t2("booking"))}
              <svg
                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                  open && "rotate-180"
                }`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                  fill=""
                />
              </svg>
            </Link>

            <div
              className={`translate transform overflow-hidden ${
                !open && "hidden"
              }`}
            >
              <ul className="flex flex-col pl-6">
                <Link
                  href="/parking/booking/viewlist"
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("booking") && "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <VscBook className="w-4 h-4" />
                  {capitalize(t2("all"))}
                </Link>
              </ul>
            </div>
          </>
        );
      }}
    </SidebarLinkGroup>
  );

  const commerceCredits = () => {
    if (role !== "company" || !userContent) return;
    // const { credits } = userContent.info as Company;
    const credits = 0;
    return (
      <p className="text-foreground-300 text-md lg:text-sm lg:flex gap-1 items-center">
        {capitalize(t("balance"))}:
        <strong className="flex items-center text-foreground-500">
          <FaEuroSign />
          {showBalance ? "*****" : credits}
        </strong>
      </p>
    );
  };

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("role");
    setSidebarOpen(false);
    dispatch(logoutUser());
    router.push("/login");
  };

  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const testUser = async () => {
    console.log("se empieza a ejec");

    try {
      const user = await authService.getUser();
      console.log({ user });
    } catch (e) {
      console.log({ e });
    }
  };

  useEffect(() => {
    // testUser();
  }, []);

  return (
    <aside
      suppressHydrationWarning
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black border-gray-900 border-r-1 duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-start lg:justify-center gap-2 px-6 py-5.5 lg:py-6.5 mt-4">
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <VscArrowLeft className="w-6 h-6" />
        </button>
        <Link href={`/${role ? role : ""}`}>
          <Image width={50} height={32} src={logo} alt="Logo" />
        </Link>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear h-full">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-4 lg:mt-9 lg:px-6 flex flex-col justify-between h-full">
          {/* <!-- Menu Group --> */}
          <ul className="mb-6 flex flex-col gap-1.5">
            {/* <!-- Menu Item Booking --> */}
            <li>Menu</li>
            {type && type === "company" ? commerceGroup : parkingGroup}
            <Link
              href="/faq"
              onClick={() => setSidebarOpen(false)}
              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname?.includes("booking") && "bg-graydark dark:bg-meta-4"
              }`}
            >
              <FaQuestion className="w-4 h-4" />
              {capitalize(t2("faq"))}
            </Link>
            {/* <!-- Menu Item Booking --> */}
          </ul>
          <ul className="mb-6 flex flex-col gap-1.5">
            <SidebarLinkGroup activeCondition={false}>
              {(handleClick, open) => {
                return (
                  <>
                    <Link
                      href="#"
                      className={`group flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        (pathname === "/auth" || pathname.includes("auth")) &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        sidebarExpanded
                          ? handleClick()
                          : setSidebarExpanded(true);
                      }}
                    >
                      <VscCircleFilled className="w-[20px] h-[20px] fill-success-500" />
                      <div className="flex flex-col">
                        <p>
                          {userContent && userContent.user
                            ? `${userContent.user.first_name} ${userContent.user.last_name}`
                            : capitalize(t("auth"))}
                        </p>
                        {commerceCredits()}
                      </div>
                      <svg
                        className={` fill-current ${open && "rotate-180"}`}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                          fill=""
                        />
                      </svg>
                    </Link>
                    {/* <!-- Dropdown Menu Start --> */}
                    <div
                      className={`translate transform overflow-hidden ${
                        !open && "hidden"
                      }`}
                    >
                      <ul className="flex flex-col gap-2 pl-6">
                        <>
                          <SidebarLinkGroup activeCondition={false}>
                            {(handleClick, open) => {
                              return (
                                <>
                                  <div
                                    onClick={handleClick}
                                    className={`group flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
                                  >
                                    <HiLanguage className="w-[20px] h-[20px]" />
                                    {capitalize(t("language"))}
                                    <svg
                                      className={` fill-current ${
                                        open && "rotate-180"
                                      }`}
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                        fill=""
                                      />
                                    </svg>
                                  </div>
                                  <div
                                    className={`flex gap-1.5 pl-12 ${
                                      !open && "hidden"
                                    }`}
                                  >
                                    {localesConfig.map((locale, i) => (
                                      <Button
                                        key={i}
                                        size="sm"
                                        className=" min-w-[unset] max-w-3"
                                        color="secondary"
                                        onClick={() =>
                                          handleChangeLocale(locale)
                                        }
                                      >
                                        {capitalize(locale)}
                                      </Button>
                                    ))}
                                  </div>
                                </>
                              );
                            }}
                          </SidebarLinkGroup>
                          <button
                            onClick={handleLogout}
                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white `}
                          >
                            <VscSignOut className="w-[20px] h-[20px]" />
                            {capitalize(t("logout"))}
                          </button>
                        </>
                      </ul>
                    </div>
                  </>
                );
              }}
            </SidebarLinkGroup>
          </ul>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
