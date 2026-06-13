'use client'

import type { ThemeProviderProps } from "@wrksz/themes/next";

import * as React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { QueryProvider } from "./QueryProvider";
import { ViewsProvider } from "./ViewsProvider";

import { persistor, store } from "@/src/store/store";
import SocketConnectionManager from "@/src/socket/SocketConnectionManager";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps<"light" | "dark">
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <QueryProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SocketConnectionManager />


              <ViewsProvider>{children}</ViewsProvider>

          </PersistGate>
        </Provider>
    </QueryProvider>
  );
}
