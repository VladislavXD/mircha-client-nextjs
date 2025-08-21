"use client";
import { usePathname } from "next/navigation";
import Header from "./components/layout/Header";
import Container from "./components/layout/container";
import Navbar from "./components/layout/Navbar";
import AuthGuard from "./AuthGuard";
import TokenInitializer from "./TokenInitializer";
import BottomNav from "./components/layout/BottomNavbar";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Убираем сложную логику проверки - middleware уже все сделал
  const isAuthPage = pathname?.startsWith('/auth');
  
  return (
    <>
      <TokenInitializer />
      {/* Если страница auth - рендерим без Layout */}
      {isAuthPage ? (
        <div className="relative flex flex-col h-screen">
          <main className="container mx-auto max-w-7xl px-6 flex-grow">
            {children}
          </main>
        </div>
      ) : (
        /* Обычный Layout с AuthGuard для защищённых страниц */
        <div className="relative flex flex-col h-screen">
          {/* Основной контент без отступа от header */}
          <div className="flex flex-1 overflow-hidden">
            <div className="container mx-auto max-w-7xl px-6 flex flex-1 overflow-hidden flex-col">
              {/* Header с границей снизу, только над контентом */}
              <div className="bg-background border-b  border-zinc-700">
                <Header />
              </div>
              
              {/* Контент под header */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar с фиксированной высотой и границей справа */}
                <div className="hidden md:flex w-56 shrink-0 flex-col border-r border-zinc-700 overflow-y-auto">
                  <div className="p-4">
                    <Navbar />
                  </div>
                </div>
                
                {/* Основной контент с прокруткой без видимого скроллбара */}
                <div className="flex-1 flex flex-col min-w-0 border-zinc-700 border-r overflow-hidden">
                  <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
                    <AuthGuard>{children}</AuthGuard>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Navigation для мобильных */}
          <div className="md:hidden">
            <BottomNav/>
          </div>
        </div>
      )}
    </>
  );
}
