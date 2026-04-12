import type { Metadata } from "next";

import {
  ProfileSettings,
  SettingsPageWrapper,
} from "@/src/features/user/components";

export const metadata: Metadata = {
  title: "Профиль | Настройки",
};

export default function ProfilePage() {
  return (
    <SettingsPageWrapper title="Профиль">
      <ProfileSettings />
    </SettingsPageWrapper>
  );
}
