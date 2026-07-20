"use client";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";

import Header from "../shared/components/layout/Header";
import Navbar from "../shared/components/layout/Navbar";
import BottomNav from "../shared/components/layout/BottomNavbar";
import RightSideBar from "../shared/components/layout/RightSideBar";

import AuthGuard from "./[locale]/AuthGuard";

import { SettingsModal } from "@/src/features/user/components/SettingsModal/SettingsModal";
import { openCreatePostModal } from "@/src/store/CreatePostModal/CreatePostModal.slice";
import { CreatePostModal } from "@/src/features/post/createPost/CreatePostModal";
import Link from "next/link";

import { useProfile } from "@/src/features/profile";
import AuthDialog from "@/shared/components/ui/Modals/IsAuthModal";
import { useAppSelector } from "@/src/hooks/reduxHooks";
import {
  closeAuthModal,
  openAuthModal,
} from "@/src/store/authModal/authModal.slice";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOpen = useAppSelector((s) => s.sidebar.isOpen); 
  const {
    isOpen: isOpenAuthModal,
    title,
    description,
    icon,
  } = useAppSelector((s) => s.authModal);
  const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/);
  const locale = localeMatch?.[1];
  const { isAuthenticated } = useProfile();
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthPage = pathname?.includes("/auth");
  const isAdminPage = pathname?.includes("/admin");
  const isLegalPage = pathname?.includes("/legal");

  const prefix = locale ? `/${locale}` : "";

  const hideRightSidebar =
    pathname?.includes(`${prefix}/dashboard/settings`) ||
    pathname?.includes(`${prefix}/chat`);

  if (isAdminPage) return <>{children}</>;

  if (isAuthPage) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <main className="container mx-auto max-w-7xl px-6 flex-grow">
          {children}
        </main>
      </div>
    );
  }

  if (isLegalPage) return <>{children}</>;

  return (
    <>
      <AuthDialog
        open={isOpenAuthModal}
        onOpenChange={(open) => !open && dispatch(closeAuthModal())}
        title={title}
        description={description}
        onLogin={() => router.push("/auth")}
        icon={icon}
      />
      <CreatePostModal />

      {/* Floating кнопка создания поста */}
      <div
        className="fixed right-4 bottom-20 md:right-10 md:bottom-10 z-50 rounded-[1.25rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#101010] cursor-pointer w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg sm:hover:bg-neutral-50 sm:dark:hover:bg-[#181818] hover:scale-105 active:scale-95 transition-all duration-200"
        onClick={() =>
          isAuthenticated
            ? dispatch(openCreatePostModal())
            : dispatch(
                openAuthModal({
                  title: "Войдите, чтобы создавать посты",
                  description:
                    "Войдите, чтобы создавать посты, делиться идеями и общаться.",
                  icon: "Pencil",
                }),
              )
        }
      >
        <Plus className="text-neutral-700 dark:text-neutral-300" size={28} />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background ">
        <div className="container mx-auto max-w-7xl">
          <Header />
        </div>
      </header>

      {/* Main layout */}
      <div className="container mx-auto max-w-7xl flex  ">

        {/* Left Sidebar — sticky */}
        <aside
          className={`hidden md:flex shrink-0 flex-col sticky top-[1px] self-start h-[calc(100vh-57px)] overflow-y-auto scrollbar-hide transition-[width] duration-300 ease-in-out ${
            isOpen ? "w-56" : "w-[68px]"
          }`}
        >
          <div
            className="p-4 h-full"
            style={{
              paddingLeft: isOpen ? "1rem" : "0.5rem",
              paddingRight: isOpen ? "1rem" : "0.5rem",
            }}
          >
            <Navbar />
          </div>
        </aside>

        {/* Center — основной контент, скролл на window */}
        <main className="flex-1 min-w-0 sm:mt-5 mt-0 pb-24 md:pb-8">
          <AuthGuard>{children}</AuthGuard>
          <SettingsModal />
        </main>

        {/* Right Sidebar — sticky */}
        {!hideRightSidebar && (
          <aside className="hidden md:block w-72 shrink-0 sticky top-[1px] self-start h-[calc(100vh-57px)] overflow-y-auto scrollbar-hide ">
            <div className="p-4">
              <RightSideBar />
              <div className="mt-6 text-xs text-gray-500 flex flex-col gap-3">
                <Link href="/legal/terms" className="hover:text-gray-400 ease-in-out">
                  Условия использования
                </Link>
                <Link href="/legal/privacy" className="hover:text-gray-400 ease-in-out">
                  Конфиденциальность
                </Link>
                <Link href="/about" className="hover:text-gray-400 ease-in-out">
                  О нас
                </Link>
                <span>© 2026 ООО «Mirchan»</span>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </>
  );
}