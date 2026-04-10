import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNGN(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) return '₦0.00'
  
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount)
}

export function calcCharge(rate: number, quantity: number): number {
  // Calculate charge based on rate (per 1000) and quantity
  // Formula: (rate / 1000) * quantity
  return (rate / 1000) * quantity;
}