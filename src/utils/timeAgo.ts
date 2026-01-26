const rtf = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });

export function timeAgo(date: Date | string ) {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  const diff = (parsedDate.getTime() - Date.now()) / 1000;

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds) {
      return rtf.format(Math.round(diff / seconds), unit);
    }
  }
}
