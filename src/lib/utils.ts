import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDuration(seconds: number): string {
  const ss = Math.floor(seconds) % 60;
  const mm = Math.floor(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600);

  const paddedSs = ss.toString().padStart(2, '0');
  const paddedMm = mm.toString().padStart(2, '0');

  if (hh > 0) {
    const paddedHh = hh.toString().padStart(2, '0');
    return `${paddedHh}:${paddedMm}:${paddedSs}`;
  }
  return `${paddedMm}:${paddedSs}`;
}
