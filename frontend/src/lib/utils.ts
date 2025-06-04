import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatPoints(points: number) {
  return new Intl.NumberFormat('pt-BR').format(points)
}

export function getPositionBadge(position: number) {
  if (position === 1) return { emoji: '🥇', color: 'text-yellow-600' }
  if (position === 2) return { emoji: '🥈', color: 'text-gray-400' }
  if (position === 3) return { emoji: '🥉', color: 'text-orange-600' }
  return { emoji: `${position}º`, color: 'text-gray-600' }
}
