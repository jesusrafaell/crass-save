/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import WelcomeBanner from "@/components/WelcomeBanner";
import { Parking } from "@/interfaces/auth";
import { IBooking } from "@/interfaces/booking";
import boookingService from "@/services/booking.service";
import { RootState } from "@/store";
import { deleteCookie, getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FC, useMemo, useState } from "react";
import { TbBrandBooking } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";

const Commerce: FC = () => {
  const t = useTranslations("dashboard");
  const role = getCookie("role");
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [bookings, setbookings] = useState<IBooking[]>([]);

  const fetchBookings = async () => {
    if (!user) return;
    const { id } = user.info as Parking;
    const data = await boookingService.getAll({ parkingId: id });
    setbookings(data);
  };

  useMemo(async () => {
    await fetchBookings();
  }, []);

  if (!user) {
    deleteCookie("token");
    deleteCookie("role");
    // replace(`/login?session=${encodeURIComponent('expired')}`);
    // refresh();
    return;
  }

  // const { name } = user.info as Parking;
  const name = "partcin";

  return (
    <div className="w-full h-full sm:flex-col px-8 gap-4 place-items-center">
      <section className="w-full flex flex-col md:flex-row justify-between items-end md:items-center my-4 gap-2 md:gap-4">
        <WelcomeBanner name={name} message={t("welcome")} />
        {/* balance component */}
      </section>
      <section
        id="dashboard-items"
        className="w-full h-full  grid grid-cols-3 items-center gap-6"
      >
        {/* <div className='flex items-center col-span-3 md:col-span-1 justify-between p-5 bg-slate-800 rounded shadow-sm min-h-[120px]'>
					<div>
						<div className='text-sm text-gray-100 '>{t('cards.totalParkingsTitle')}</div>
						<div className='flex items-center pt-1'>
							<div className='text-4xl font-medium text-indigo-400 '>{parkings.length}</div>
						</div>
					</div>
					<div className='text-gray-300 flex flex-col items-center justify-center '>
						<FaParking className='text-pink-700 text-4xl' />
					</div>
				</div> */}

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
              href="/parking/booking/viewlist"
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
          <div className="text-gray-300 flex flex-col items-center justify-center">
            <TbBrandBooking className="text-pink-700 text-4xl" />
            <Link
              href="/parking/booking/viewlist"
              className="text-blue-500 hover:text-blue-700"
            >
              {t("cards.totalBookingsActiveCta")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Commerce;
