import type { Metadata } from "next";

import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat conversations",
};

export default function ChatPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-muted/20">
      <div className="bg-background/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-border/50 flex flex-col items-center max-w-sm text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-2">
          Ваши сообщения
        </h2>
        <p className="text-muted-foreground text-sm">
          Выберите чат из списка слева, чтобы начать общение или найдите новых
          собеседников
        </p>
      </div>
    </div>
  );
}
