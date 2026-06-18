"use client";

import NextTopLoader from "nextjs-toploader";

import LayoutContent from "../../app/LayoutContent";

import { Providers } from "./providers";
import PageLoader from "./PageLoader";

import { Toaster } from "@/components/ui/sonner";
import { UIProvider } from "../context/UIContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageLoader />
      <Providers>
        <Toaster />
        <UIProvider>
          <LayoutContent>{children}</LayoutContent>
        </UIProvider>
      </Providers>
    </>
  );
}
