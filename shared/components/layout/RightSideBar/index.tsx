"use client";
import React from "react";
import { usePathname } from "next/navigation";

import SearchUser from "../../ui/Search";
import NewsWidget from "../../ui/NewsWidget";
import LatestPosts from "../../ui/LatestPosts";
import ForumStats from "../../ui/ForumStats";
type Props = {};

const RightSideBar = (props: Props) => {
  const pathname = usePathname();

  return (
    <div className="space-y-6 scrollbar-hide">
      {!pathname.includes("/search") ? <SearchUser /> : null}
      {!pathname.includes("/search") ? <NewsWidget /> : null}
      <LatestPosts />
      <ForumStats />
    </div>
  );
};

export default RightSideBar;
