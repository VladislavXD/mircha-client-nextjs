"use client";

import NextTopLoader from "nextjs-toploader";

import LayoutContent from "../../app/LayoutContent";

import { Providers } from "./providers";
import PageLoader from "./PageLoader";

import { Toaster } from "@/components/ui/sonner";


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
        <LayoutContent>{children}</LayoutContent>
      </Providers>
    </>
  );
}
