"use client";
import { usePathname } from "next/navigation";
import Header from "../shared/components/layout/Header";
import Container from "../shared/components/layout/container";
import Navbar from "../shared/components/layout/Navbar";
import AuthGuard from "./[locale]/AuthGuard";
import BottomNav from "../shared/components/layout/BottomNavbar";
import RightSideBar from "../shared/components/layout/RightSideBar";
import Snowfall from "../shared/components/layout/Seasonal/Snowfall";
import FestiveBanner from "../shared/components/layout/Seasonal/FestiveBanner";
import { useState, useEffect } from "react";


export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [snowEnabled, setSnowEnabled] = useState(true);
  
  // Читаем настройку снега из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem("snowfall-enabled");
    if (saved !== null) {
      setSnowEnabled(saved === "true");
    }
    
    // Слушаем событие переключения снега из Header
    const handleToggle = (e: CustomEvent<boolean>) => {
      setSnowEnabled(e.detail);
    };
    
    window.addEventListener('snowfall-toggle', handleToggle as EventListener);
    return () => {
      window.removeEventListener('snowfall-toggle', handleToggle as EventListener);
    };
  }, []);
  
  // Убираем сложную логику проверки - middleware уже все сделал
  const isAuthPage = pathname?.startsWith('/auth');
  const hideRightSidebar = pathname?.includes('/dashboard/settings');
  
  return (
    <>
      {/* Праздничная гирлянда */}
      <FestiveBanner />
      
      {/* Новогодний снег на всём сайте */}
      <Snowfall enabled={snowEnabled} density={50} />

      {/* Если страница auth - рендерим без Layout */}
      {isAuthPage ? (
        <div className="relative flex flex-col h-screen">
          <main className="container mx-auto max-w-7xl px-6 flex-grow">
            {children}
          </main>
        </div>
      ) : (
        /* Обычный Layout с AuthGuard для защищённых страниц */
        <div className="relative flex flex-col h-screen mb-0">
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
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <div className="flex-1 p-4 overflow-y-auto scrollbar-hide mb-8">
                    <AuthGuard>{children}</AuthGuard>
                  </div>
                </div>
                
                {!hideRightSidebar && (
                  <div className="hidden md:block w-72 shrink-0 flex-col border-l border-zinc-700 overflow-y-auto">
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
            <BottomNav/>
          </div>
        </div>
      )}
    </>
  );
}
