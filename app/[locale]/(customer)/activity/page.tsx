import React from "react";
import { Metadata } from "next";

import NotificationPage from "./NotificationPage";

type Props = {};
export const metadata: Metadata = {
  title: "Notification",
  description: "List of notifications",
  // ...NO_INDEX_PAGE
};

const Notification = (props: Props) => {
  return <NotificationPage />;
};

export default Notification;
