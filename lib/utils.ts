import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSemester(value: string): string {
  const map: Record<string, string> = {
    '1th Semester': '1st Semester',
    '2th Semester': '2nd Semester',
    '3th Semester': '3rd Semester',
    '4th Semester': '4th Semester',
    '5th Semester': '5th Semester',
    '6th Semester': '6th Semester',
    '7th Semester': '7th Semester',
    '8th Semester': '8th Semester',
  }
  return map[value] || value
}
