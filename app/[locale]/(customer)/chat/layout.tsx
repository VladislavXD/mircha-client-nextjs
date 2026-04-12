"use client";

import React, { useState, useEffect } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

import { ChatList } from "./ChatList";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  const isChatWindowOpen = segment !== null;
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  if (isMobile) {
    return (
      <div className={`flex w-full overflow-hidden sm:rounded-xl bg-background border border-border mt-0 ${isChatWindowOpen ? "fixed inset-0 z-[100] h-[100dvh] flex-col" : "h-[calc(100dvh-12rem)] sm:h-[calc(100vh-8rem)]"}`}>
        <div
          className={`w-full shrink-0 border-r border-border bg-background flex flex-col ${
            isChatWindowOpen ? "hidden" : "flex"
          }`}
        >
          <ChatList isCollapsed={false} />
        </div>

        <div
          className={`flex-1 flex-col bg-muted/30 ${
            isChatWindowOpen ? "flex" : "hidden"
          }`}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-12rem)] sm:h-[calc(100vh-8rem)] w-full overflow-hidden border border-border sm:rounded-xl bg-background relative mt-0 shadow-sm">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel
          className="bg-background flex flex-col min-w-0 overflow-hidden"
          defaultSize={100}
          maxSize={500}
          minSize={100}
          onResize={(sizeOrObj) => {
            let numSize = 100;

            if (typeof sizeOrObj === "number") {
              numSize = sizeOrObj;
            } else if (
              sizeOrObj &&
              typeof (sizeOrObj as any).asPercentage === "number"
            ) {
              numSize = (sizeOrObj as any).asPercentage;
            }
            setIsCollapsed(numSize <= 12);
          }}
        >
          <ChatList isCollapsed={isCollapsed} />
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border" />

        <ResizablePanel
          className="bg-background flex flex-col min-w-0 overflow-hidden"
          defaultSize={70}
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
