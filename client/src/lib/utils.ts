import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  try {
    return format(parseISO(date), "dd/MM/yyyy");
  } catch (error) {
    return "";
  }
}

export function generateRandomCode(length: number = 6): string {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
}

export function isUserExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false;
  try {
    const expirationDate = parseISO(expiresAt);
    return expirationDate < new Date();
  } catch (error) {
    return false;
  }
}

export function getRoleColor(role: string): string {
  switch (role.toLowerCase()) {
    case "admin":
      return "text-primary bg-primary/10";
    default:
      return "text-foreground bg-secondary/50";
  }
}

export function getRoleBadgeStyle(role: string): string {
  return cn(
    "px-2 py-1 rounded-full text-xs",
    role.toLowerCase() === "admin" 
      ? "bg-primary/10 text-primary" 
      : "bg-secondary/50 text-foreground"
  );
}
