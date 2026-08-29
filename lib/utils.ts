import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// No consumers today, deliberately: this is the shadcn substrate,
// still wired up via components.json for any component added later.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
