"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';


import { ViewsProvider } from "@/shared/components/providers/ViewsProvider";
import ReCapchaProvider from "./ReCapchaProvider";
import { persistor, store } from "@/src/store/store";
import { QueryProvider } from "./QueryProvider";
import SocketConnectionManager from '@/src/features/socket/SocketConnectionManager';


export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <QueryProvider>
      <HeroUIProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SocketConnectionManager />

              <NextThemesProvider {...themeProps}>
                <ViewsProvider>{children}</ViewsProvider>
              </NextThemesProvider>

          </PersistGate>
        </Provider>
      </HeroUIProvider>
    </QueryProvider>
  );
}
