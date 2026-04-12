import type { Metadata } from "next";

// import { NO_INDEX_PAGE } from '../../constants/seo.constants'
import { GroupChatWindow } from "./GroupChatWindow";

export const metadata: Metadata = {
  title: "Group Chat",
  // ...NO_INDEX_PAGE
};

export default function GroupPage() {
  return <GroupChatWindow />;
}
