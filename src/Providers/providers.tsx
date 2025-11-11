"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider, useSelector } from "react-redux";
import { store } from "../store/store";

import { ViewsProvider } from "@/app/components/providers/ViewsProvider";
import ReCapchaProvider from "./ReCapchaProvider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <Provider store={store}>
        <ReCapchaProvider>
          <NextThemesProvider {...themeProps}>
            <ViewsProvider>{children}</ViewsProvider>
          </NextThemesProvider>
        </ReCapchaProvider>
      </Provider>
    </HeroUIProvider>
  );
}
