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
  
  // If it's a single digit, return "1st Semester"
  if (ordinals[value]) {
    return `${ordinals[value]} Semester`
  }

  // If it's already in the format "1st Semester" or "1th Semester", fix ordinals
  return value.replace(/^(\d+)(?:st|nd|rd|th)?\s*Semester$/i, (_, n) => {
    return `${ordinals[n] ?? n + 'th'} Semester`
  }) || value
}
