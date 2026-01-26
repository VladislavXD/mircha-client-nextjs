"use client";

import React from "react";
import {Alert, Button, Spinner} from "@heroui/react";
import { CiGift } from "react-icons/ci";
import { useGetActiveNotices } from "../hooks/useGetActiveNotice";
import { useCurrentUser } from "../../user";
import Image from "next/image";

const colorMap: Record<string, any> = {
	default: 'default',
	info: 'info',
	warning: 'warning',
	error: 'danger'
}

export default function Notice() {
  const { notices, isLoading } = useGetActiveNotices();
  const {isAuthenticated} = useCurrentUser()

  const [hidden, setHidden] = React.useState<Record<string, boolean>>({});

  if (isLoading) return null;

  const items = Array.isArray(notices) ? notices.filter((n: any) => !hidden[n.id]) : [];

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {items.map((n: any) => (
        <Alert
          key={n.id}
          color={colorMap[n.type] || 'default'}
          description={<p>{n.content}</p>}
          isVisible={!hidden[n.id]}
          title={<>
            <div className="flex items-center justify-between">
              <div className="text-sm">{n.title}</div>
              <div className="ml-4 text-xs text-default-400">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          </>}
          variant="faded"
          icon={
            n.emojiUrl ? (
              <Image src={n.emojiUrl} alt="emoji" className="w-24 h-24 object-cover rounded-lg" width={100} height={100} />
            ) : (
              <CiGift className="w-8 h-8"/>
            )
          }
          onClose={() => isAuthenticated ? setHidden(h => ({...h, [n.id]: true})) : null}
        />
      ))}
    </div>
  );
}

