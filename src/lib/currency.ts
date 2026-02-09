
export const EXCHANGE_RATE_JPY_TO_USD = 1 / 150; // 1 USD = 150 JPY

export function formatCurrency(amountInJpy: number, language: "en" | "ja"): string {
  if (amountInJpy === Infinity) {
    return language === "ja" ? "無制限" : "Uncapped";
  }
  
  if (language === "ja") {
    return `¥${amountInJpy.toLocaleString()}`;
  } else {
    // Round to nearest integer for USD
    const amountInUsd = Math.round(amountInJpy * EXCHANGE_RATE_JPY_TO_USD);
    return `$${amountInUsd.toLocaleString()}`;
  }
}

export function getCurrencySymbol(language: "en" | "ja"): string {
  return language === "ja" ? "¥" : "$";
}
