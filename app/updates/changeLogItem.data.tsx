import React from "react";
import { type ChangelogEntry, categoryConfig } from "./changeLog.data";

type Props = {
  entry: ChangelogEntry;
  isFirst?: boolean;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ChangelogItem({ entry, isFirst }: Props) {
  return (
    <div className={`pb-6 ${!isFirst ? "border-t pt-6" : ""}`}>
      {/* Шапка: версия + дата */}
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          v{entry.version}
        </span>
        <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
        {isFirst && (
          <span className="ml-auto text-xs font-medium bg-primary text-primary-foreground rounded-full px-2 py-0.5">
            Новое
          </span>
        )}
      </div>

      {/* Заголовок */}
      <h3 className="font-semibold text-base leading-snug mb-1">{entry.title}</h3>

      {/* Описание (необязательно) */}
      {entry.description && (
        <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>
      )}

      {/* Список изменений */}
      <ul className="space-y-2 mt-3">
        {entry.changes.map((change, i) => {
          const cfg = categoryConfig[change.category];
          return (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span
                className={`mt-0.5 flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none ${cfg.color} ${cfg.bg}`}
              >
                {cfg.label}
              </span>
              <span className="text-foreground leading-snug">{change.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}