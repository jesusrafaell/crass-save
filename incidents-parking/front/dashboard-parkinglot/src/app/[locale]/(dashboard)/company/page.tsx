/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import WelcomeBanner from "@/components/WelcomeBanner";
import GlobalContext from "@/context/Global";
import { Company } from "@/interfaces/auth";
import { IBooking } from "@/interfaces/booking";
import boookingService from "@/services/booking.service";
import companyService from "@/services/company.service";
import { RootState } from "@/store";
import { refreshCompany } from "@/store/auth/authSlice";
import { Divider } from "@nextui-org/react";
import { deleteCookie, getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FC, useContext, useEffect, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaEuroSign, FaParking } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoIosAddCircle } from "react-icons/io";
import { MdCreditScore } from "react-icons/md";
import { TbBrandBooking, TbTransferVertical } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useGetCompanyData } from "@/hooks/useCompany";

const Commerce: FC = () => {
  const t = useTranslations("dashboard");
  const role = getCookie("role");
  const dispatch = useDispatch();
  const { parkings, showBalance, toggleShowBalance } =
    useContext(GlobalContext);
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: companyData } = useGetCompanyData("");

  const [bookings, setbookings] = useState<IBooking[]>([]);

  const fetchBookings = async () => {
    if (!user) return;
    const { id } = user.info as Company;
    const data = await boookingService.getAll({ companyId: id });
    setbookings(data);
  };

  //   useMemo(async () => {
  //     if (role === "company" && user) {
  //       const { id } = user.info as Company;
  //       await fetchBookings();
  //       const resCompany = await companyService.get(id);
  //       dispatch(refreshCompany(resCompany));
  //     }
  //   }, []);

  useEffect(() => {
    (async () => {
      if (role === "company" && user) {
        await fetchBookings();
        if (companyData) dispatch(refreshCompany(companyData));
      }
    })();
  }, [role, user, companyData]);

  if (!user) {
    deleteCookie("token");
    deleteCookie("role");
    // replace(`/login?session=${encodeURIComponent('expired')}`);
    // refresh();
    return;
  }

  // const {
  //   // id,
  //   // credits,
  //   // name,
  // } = user.info as Company;
  const credits = 0;
  const name = "";
  // const { data } = useGetParkingListByIdCompany(id);
  // console.log(user)

  return (
    <div className="w-full h-full sm:flex-col px-4 md:px-8 gap-4 place-items-center">
      <section className="w-full flex flex-col md:flex-row justify-between items-end md:items-center my-4 gap-2 md:gap-4">
        <WelcomeBanner name={name} message={t("welcome")} />
        {/* balance component */}
        <div className="flex items-center justify-center w-[180px] bg-gray-700 h-[40px] rounded-md">
          <div className="flex items-center justify-center gap-3 text-white">
            <button onClick={toggleShowBalance}>
              {showBalance ? (
                <BsEyeSlash className="text-[24px]" />
              ) : (
                <BsEye className="text-[24px]" />
              )}
            </button>

            <h4 className="flex items-center justify-center">
              {showBalance ? (
                "* * * * * * *"
              ) : (
                <>
                  <FaEuroSign /> {credits}
                </>
              )}
            </h4>
          </div>
        </div>
      </section>
      <section
        id="dashboard-items"
        className="w-full h-full  grid grid-cols-3 items-center gap-6"
      >
        <div className="flex items-center col-span-3 md:col-span-1 justify-between p-5 bg-slate-800 rounded shadow-sm min-h-[120px]">
          <div>
            <div className="text-sm text-gray-100 ">
              {t("cards.totalParkingsTitle")}
            </div>
            <div className="flex items-center pt-1">
              <div className="text-4xl font-medium text-indigo-400 ">
                {parkings.length}
              </div>
            </div>
          </div>
          <div className="text-gray-300 flex flex-col items-center justify-center ">
            <FaParking className="text-pink-700 text-4xl" />
          </div>
        </div>

        <div className="flex items-center col-span-3 md:col-span-1 justify-between p-5 bg-slate-800 rounded shadow-sm min-h-[120px]">
          <div>
            <div className="text-sm text-gray-100 ">
              {t("cards.totalBookingActiveTitle")}
            </div>
            <div className="flex items-center pt-1">
              <div className="text-4xl font-medium text-indigo-400 ">
                {bookings.length}
              </div>
            </div>
          </div>
          <div className="text-gray-300 flex flex-col items-center justify-center">
            <TbBrandBooking className="text-pink-700 text-4xl" />
            <Link
              href="/company/booking/viewlist"
              className="text-blue-500 hover:text-blue-700"
            >
              {t("cards.totalBookingsActiveCta")}
            </Link>
          </div>
        </div>

        <div className="flex items-center col-span-3 md:col-span-1 justify-between p-5 bg-slate-800 rounded shadow-sm min-h-[120px]">
          <div>
            <div className="text-sm  text-gray-100">
              {t("cards.totalBookingCompletedTitle")}
            </div>
            <div className="flex items-center pt-1">
              <div className="text-4xl font-medium text-indigo-400 ">
                {
                  bookings.filter((item) => item.status.name === "completado")
                    .length
                }
              </div>
            </div>
          </div>
          <div className="text-gray-300 flex flex-col items-center justify-center ">
            <IoIosAddCircle className="text-green-600 text-4xl" />
            <Link
              href="/company/booking/create"
              className="text-blue-500 hover:text-blue-700"
            >
              {t("cards.totalBookingCompletedCta")}
            </Link>
          </div>
        </div>
        <div className="w-full  flex flex-col py-4 items-center col-span-3 md:col-span-1 bg-sky-900 rounded-md px-6 min-h-[340px]">
          <div className="w-full">
            <h2 className="text-left text-[40px]">
              {t("cards.bookings.title")}
            </h2>
            <Divider className="bg-white" />
          </div>
          <div className="flex flex-col col-span-2 justify-center text-gray-300 list-inside py-5">
            <div className="w-full flex">
              <GoDotFill className="text-orange-700 text-4xl flex-shrink-0 mt-1" />
              <h4 className="text-justify py-2">
                {t("cards.bookings.helpText")}&nbsp;
              </h4>
            </div>
          </div>
          <div className="w-full flex col-span-3 justify-between px-6 items-center py-2">
            <Link
              href="/faq"
              className="flex items-center text-blue-400 hover:text-blue-300"
            >
              {t("cards.bookings.faqsCta")}&nbsp;
              <FaArrowRightLong />
            </Link>
          </div>
        </div>
        <div className="w-full flex flex-col col-span-3 md:col-span-2 bg-indigo-950 rounded-md py-4 px-6 min-h-[340px]">
          <div className="w-full">
            <h2 className="text-left text-[40px]">
              {t("cards.infoBuyCredits.title")}
            </h2>
            <Divider className="bg-white" />
          </div>
          <div className="grid grid-cols-3">
            <div className="flex flex-col col-span-3 md:col-span-2 justify-center text-gray-300 list-inside">
              <div className="w-full flex">
                <GoDotFill className="text-pink-700 text-4xl flex-shrink-0 mt-1" />
                <h4 className="text-justify py-2">
                  {t("cards.infoBuyCredits.buyCredits")}&nbsp;
                </h4>
              </div>
            </div>
            <div className="w-full flex md:flex-col  col-span-3 md:col-span-1 justify-center items-center ml-0 md:ml-3  gap-3 md:gap-5 py-2">
              <FaEuroSign className="text-[35px] md:text-[55px] text-amber-400 " />{" "}
              <TbTransferVertical className="text-[15px] md:text-[25px] text-blue-500" />{" "}
              <MdCreditScore className="text-[35px] md:text-[55px] text-green-500" />
            </div>
            <div className="w-full flex md:flex-row flex-col text-center col-span-3 md:justify-between px-6 items-center py-2">
              <Link
                href="/credits/buy"
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
              >
                {t("cards.infoBuyCredits.cta")}
              </Link>

              <Link
                href="/faq"
                className="flex items-center justify-center text-blue-500 hover:text-blue-700"
              >
                {t("cards.infoBuyCredits.faqsCta")}&nbsp;
                <FaArrowRightLong />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Commerce;
