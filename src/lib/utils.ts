
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CREDIT_LEVELS, CreditLevel } from "./credit-types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates if the selected price is within the host's credit level cap.
 * @param price The hourly price set by the host.
 * @param level The host's current credit level (1-4).
 * @returns { isValid: boolean, maxPrice: number, message?: string }
 */
export function validateHostPrice(price: number, level: CreditLevel) {
  const tier = CREDIT_LEVELS[level];
  const maxPrice = tier.maxPrice;

  if (price > maxPrice) {
    return {
      isValid: false,
      maxPrice,
      message: `Your current level (${level}) limits pricing to ¥${maxPrice}/hour. Upgrade your level to unlock higher rates.`
    };
  }

  return { isValid: true, maxPrice };
}
