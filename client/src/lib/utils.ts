import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getInitials(name: string, limit: number = 2): string {
  if (!name || typeof name !== "string") return "";

  return name
    .trim()
    .split(/\s+/) // Split by whitespace
    .slice(0, limit) // Take only the first 'limit' names
    .map((word) => word.charAt(0).toUpperCase()) // Get first letter and capitalize
    .join("");
}
