"use client";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

import Header from "../shared/components/layout/Header";
import Navbar from "../shared/components/layout/Navbar";
import BottomNav from "../shared/components/layout/BottomNavbar";
import RightSideBar from "../shared/components/layout/RightSideBar";

import AuthGuard from "./[locale]/AuthGuard";

import { SettingsModal } from "@/src/features/user/components/SettingsModal/SettingsModal";
import { RootState } from "@/src/store/store";
import { openCreatePostModal } from "@/src/store/CreatePostModal/CreatePostModal.slice";
import { CreatePostModal } from "@/shared/components/ui/Modals/CreatePostModal";
import { useAppSelector } from "@/src/hooks/reduxHooks";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/);
  const locale = localeMatch?.[1];

  // Убираем сложную логику проверки - middleware уже все сделал
  const isAuthPage = pathname?.startsWith("/auth");
  const isAdminPage = pathname?.includes("/admin");
  const prefix = locale ? `/${locale}` : "";

  const hideRightSidebar =
    pathname?.includes(`${prefix}/dashboard/settings`) ||
    pathname?.includes(`${prefix}/chat`);

  const dispatch = useDispatch();
  const isCreatePostview = useAppSelector(
    (state) => state.createPostModal.createPostView,
  );

  return (
    <>
      {/* Праздничная гирлянда */}
      {/* <FestiveBanner />
      
      {/* Новогодний снег на всём сайте */}
      {/* <Snowfall enabled={snowEnabled} density={50} />  */}

      {/* Если админ-панель - рендерим без Layout (у неё свой layout) */}
      {isAdminPage ? (
        children
      ) : /* Если страница auth - рендерим без Layout */
      isAuthPage ? (
        <div className="relative flex flex-col h-screen">
          <main className="container mx-auto max-w-7xl px-6 flex-grow">
            {children}
          </main>
        </div>
      ) : (
        /* Обычный Layout с AuthGuard для защищённых страниц */
        <div className="relative flex flex-col h-screen mb-0">
          {/* Основной контент без отступа от header */}

          {/* Кнопка добавления поста в виде модалки */}
          <div
            className={`absolute right-4 bottom-20 md:right-10 md:bottom-10 z-50 rounded-[1.25rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#101010] cursor-pointer w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg sm:hover:bg-neutral-50 sm:dark:hover:bg-[#181818] hover:scale-105 active:scale-95 transition-all duration-200 ${isCreatePostview ? "opacity-0 pointer-events-none translate-y-10" : "opacity-100 translate-y-0"}`}
            onClick={() => dispatch(openCreatePostModal())}
          >
            <Plus
              className="text-neutral-700 dark:text-neutral-300"
              size={28}
            />
          </div>
          <CreatePostModal />

          <div className="flex flex-1 overflow-hidden">
            <div className="container mx-auto max-w-7xl flex flex-1 overflow-hidden flex-col">
              {/* Header с границей снизу, только над контентом */}
              <div className="bg-background border-b  border-zinc-700">
                <Header />
              </div>

              {/* Контент под header */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar с фиксированной высотой и границей справа */}
                <div
                  className={`hidden md:flex shrink-0 flex-col overflow-y-auto transition-[width] duration-300 ease-in-out ${
                    isOpen ? "w-56" : "w-[68px]"
                  }`}
                >
                  <div
                    className="p-4"
                    style={{
                      paddingLeft: isOpen ? "1rem" : "0.5rem",
                      paddingRight: isOpen ? "1rem" : "0.5rem",
                    }}
                  >
                    <Navbar />
                  </div>
                </div>

                {/* Основной контент с прокруткой без видимого скроллбара */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 md:pb-8">
                    <AuthGuard>{children}</AuthGuard>
                    <SettingsModal />
                  </div>
                </div>

                {!hideRightSidebar && (
                  <div className="hidden md:block w-72 shrink-0 flex-col  overflow-y-auto scrollbar-hide">
                    <div className="p-4">
                      <RightSideBar />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Navigation для мобильных */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>
      )}
    </>
  );
}
