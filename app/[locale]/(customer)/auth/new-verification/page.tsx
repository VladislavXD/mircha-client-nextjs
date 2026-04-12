import type { Metadata } from "next";

import { NewVerificationForm } from "@/src/features/auth/components";

export const metadata: Metadata = {
  title: "Подтверждение почты",
};

export default function NewVerificationPage() {
  return <NewVerificationForm />;
}
