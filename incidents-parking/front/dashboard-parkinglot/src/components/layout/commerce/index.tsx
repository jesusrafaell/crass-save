"use client";
import Header from "@/components/Header";
import { GlobalContextProvider } from "@/context/Global";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import logo from "@/images/crash-saver-app-logo.png";
import { FC, ReactNode, useState } from "react";
import PrivatePolicyModal from "@/components/modal/PrivatePolicyModal";
// import SideBar from "@/components/Sidebar";
const SideBar = dynamic(() => import("@/components/Sidebar"), { ssr: false });
interface ICommerce {
  children: ReactNode;
}
const CommerceLayout: FC<ICommerce> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const t2 = useTranslations("termAndConditions");

  const handleOpenModal = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <GlobalContextProvider>
      <div className="flex h-screen overflow-hidden bg-black">
        {/* <!-- ===== Sidebar Start ===== --> */}
        {
          <div className="absolute left-0 top-0 z-50 h-screen flex-col lg:relative lg:block lg:w-[262px]">
            <SideBar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              // type={role as ITypeLogin}
            />
          </div>
        }
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 flex items-center justify-center">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
          <footer className="h-full bg-gray-900 py-2">
            <div className="text-yellow-500 flex flex-col md:items-center justify-center text-center px-12 py-3 md:text-sm text-[12px]">
              <p>{t2("alertAssistence")}</p>
              <p>
                {t2("assistenceCall1")}
                <a
                  href="tel:+34609622482"
                  className="text-gray-200 hover:underline mx-1"
                >
                  609 62 24 82
                </a>
                {t2("assistenceCall2")}
              </p>
            </div>
            <div className="grid mg:grid-cols-2 px-12 py-2">
              <PrivatePolicyModal
                acceptRequired={false}
                isOpen={isOpen}
                onClose={handleOpenModal}
              />
              <div className="flex flex-col">
                <p className="mb-2 flex text-[18px] items-center gap-2 font-bold">
                  {t2("companyName")}
                </p>
                <p className="mb-1 text-sm">{t2("companyCif")}</p>
                <p className="mb-1 text-sm">{t2("companyAddress")}</p>
                <p className="mb-1 text-sm">{t2("companyContact")}</p>
                <p className="mb-1 text-sm">{t2("companyMail")}</p>
              </div>
              <div className="flex flex-col items-end justify-end">
                <a
                  className="no-underline cursor-pointer text-blue-400 font-bold hover:opacity-80"
                  onClick={handleOpenModal}
                >
                  {t2("title")}
                </a>
                {new Date().getFullYear() + ". " + t2("copyrigth")}
              </div>
            </div>
          </footer>
        </div>

        {/* <!-- ===== Content Area End ===== --> */}
      </div>
    </GlobalContextProvider>
  );
};

export default CommerceLayout;
