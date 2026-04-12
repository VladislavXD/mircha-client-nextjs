"use client";

import React from "react";
import Image from "next/image";
import { Gift, X } from "lucide-react";

import { useGetActiveNotices } from "../hooks/useGetActiveNotice";
import { useCurrentUser } from "../../user";

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Notice() {
  const { notices, isLoading } = useGetActiveNotices();
  const { isAuthenticated } = useCurrentUser();

  const [hidden, setHidden] = React.useState<Record<string, boolean>>({});

  if (isLoading) return null;

  const items = Array.isArray(notices)
    ? notices.filter((n: any) => !hidden[n.id])
    : [];

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {items.map((n: any) => (
        <Alert
          key={n.id}
          className={`relative flex flex-col sm:flex-row items-start gap-4 p-4 ${
            n.type === "info"
              ? "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              : ""
          } ${
            n.type === "warning"
              ? "bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
              : ""
          }`}
          variant={
            n.type === "error" || n.type === "danger"
              ? "destructive"
              : "default"
          }
        >
          {n.emojiUrl ? (
            <div className="relative shrink-0 w-10 h-10">
              <Image
                fill
                alt="emoji"
                className="rounded-lg object-cover"
                src={n.emojiUrl}
              />
            </div>
          ) : (
            <Gift className="shrink-0 w-8 h-8 text-primary" />
          )}

          <div className="flex-1 min-w-0">
            <AlertTitle className="flex flex-wrap items-center justify-between gap-2 mb-2 pr-6">
              <div className="text-base font-semibold">{n.title}</div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </AlertTitle>
            <AlertDescription className="text-sm text-balance">
              {n.content}
            </AlertDescription>
          </div>

          {isAuthenticated && (
            <AlertAction className="absolute top-2 right-2">
              <Button
                className="h-8 w-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                size="icon"
                variant="ghost"
                onClick={() => setHidden((h) => ({ ...h, [n.id]: true }))}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close notice</span>
              </Button>
            </AlertAction>
          )}
        </Alert>
      ))}
    </div>
  );
}
