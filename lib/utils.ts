import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSemester(value: string): string {
  const ordinals: Record<string, string> = {
    '1': '1st', '2': '2nd', '3': '3rd',
    '4': '4th', '5': '5th', '6': '6th', '7': '7th', '8': '8th',
  }
  // Handle legacy "1th", "2th", "3th" values from old data
  return value.replace(/^(\d+)th/, (_, n) => `${ordinals[n] ?? n + 'th'}`)
}
