import type { Metadata } from "next";

import {
  SecuritySettings,
  SettingsPageWrapper,
} from "@/src/features/user/components";

export const metadata: Metadata = {
  title: "Безопасность | Настройки",
};

export default function SecurityPage() {
  return (
    <SettingsPageWrapper title="Безопасность">
      <SecuritySettings />
    </SettingsPageWrapper>
  );
}
