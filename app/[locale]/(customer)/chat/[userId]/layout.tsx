import type { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "Chat Window",
  description: "Chat conversation with a specific user",
};

export default function ChatWindowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
