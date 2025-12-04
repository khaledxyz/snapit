import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date?: Date | string | number | null): string {
  const postDate = dayjs(date);
  const now = dayjs();
  const hoursAgo = now.diff(postDate, "hour");

  // Less than 24 hours: show relative time
  if (hoursAgo < 24) {
    return postDate.fromNow(); // "29 minutes ago", "2 hours ago"
  }

  // Yesterday
  if (hoursAgo < 48 && postDate.isSame(now.subtract(1, "day"), "day")) {
    return "Yesterday";
  }

  // This year: show "Jan 15"
  if (postDate.year() === now.year()) {
    return postDate.format("MMM D");
  }

  // Older: show "Jan 15, 2023"
  return postDate.format("MMM D, YYYY");
}

const WHITESPACE_REGEX = /\s+/;
export function getInitials(name: string, maxInitials = 2): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  const words = name
    .trim()
    .split(WHITESPACE_REGEX)
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return "";
  }

  return words
    .slice(0, maxInitials)
    .map((word) => word[0].toUpperCase())
    .join("");
}
