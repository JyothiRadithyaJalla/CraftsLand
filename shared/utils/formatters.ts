import { RESTAURANT_BRAND } from '../config/constants';

/**
 * Format an amount in INR with standard currency symbol and Indian comma formatting.
 * e.g. 450 -> "₹450.00"
 */
export function formatPrice(amount: number | string | null | undefined): string {
  const num = Number(amount) || 0;
  return `${RESTAURANT_BRAND.currencySymbol}${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format an amount in INR with whole numbers if no decimal.
 * e.g. 450 -> "₹450"
 */
export function formatPriceCompact(amount: number | string | null | undefined): string {
  const num = Number(amount) || 0;
  if (num % 1 === 0) {
    return `${RESTAURANT_BRAND.currencySymbol}${num.toLocaleString('en-IN')}`;
  }
  return formatPrice(num);
}
