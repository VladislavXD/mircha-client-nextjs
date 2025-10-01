"use client";
import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "@heroui/react";

export type SmartTooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode; // trigger
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
  showArrow?: boolean;
  className?: string;
  delay?: number;
  closeDelay?: number;
  shouldCloseOnBlur?: boolean;
  /** width breakpoint in px to enable mobile behavior */
  mobileBreakpoint?: number;
  /** Колбэк изменения состояния (полезно для аналитики) */
  onOpenChange?: (open: boolean) => void;
};

const SmartTooltip: React.FC<SmartTooltipProps> = ({
  content,
  children,
  placement = "top",
  showArrow = true,
  className,
  delay = 300,
  closeDelay = 0,
  shouldCloseOnBlur = true,
  mobileBreakpoint = 768,
  onOpenChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= mobileBreakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [mobileBreakpoint]);

  useEffect(() => {
    if (!isMobile || !open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      // закроем, если клик вне триггера и вне контента тултипа
      const isInTrigger = !!target.closest('[data-tooltip-trigger]');
      const isInContent = !!target.closest('[data-tooltip-content]');
      if (!isInTrigger && !isInContent) {
        setOpen(false);
        onOpenChange?.(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isMobile, open, onOpenChange]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Tooltip
      isOpen={isMobile ? open : undefined}
      content={
        <div data-tooltip-content>
          {content}
        </div>
      }
      className={className}
      placement={placement}
      showArrow={showArrow}
      delay={isMobile ? 0 : delay}
      closeDelay={closeDelay}
      shouldCloseOnBlur={!isMobile && shouldCloseOnBlur}
      onOpenChange={(isOpen) => {
        if (isMobile) {
          setOpen(isOpen);
        }
        onOpenChange?.(isOpen);
      }}
    >
      <div ref={triggerRef} onClick={handleTriggerClick} data-tooltip-trigger className="inline-block">
        {children}
      </div>
    </Tooltip>
  );
};

export default SmartTooltip;
