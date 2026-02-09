
"use client";

import { AlertTriangle, Lock, ArrowUpCircle } from "lucide-react";
import { TIER_CONFIG, CreditLevel } from "@/lib/credit-types";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";

interface PriceInputWithValidationProps {
  value: string;
  onChange: (value: string) => void;
  currentLevel: number;
  label?: React.ReactNode;
  description?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  step?: string;
}

export function PriceInputWithValidation({
  value,
  onChange,
  currentLevel,
  label = "Hourly Rate",
  description,
  placeholder = "0",
  className,
  required = false,
  step
}: PriceInputWithValidationProps) {
  const { language } = useLanguage();
  const config = TIER_CONFIG[currentLevel as CreditLevel] || TIER_CONFIG[0];
  const maxPrice = config.maxPrice;

  // Currency Conversion Logic
  const isUSD = language === "en";
  const EXCHANGE_RATE = 150; // 1 USD = 150 JPY

  const displayValue = isUSD 
    ? (value ? Math.round(parseInt(value) / EXCHANGE_RATE).toString() : "")
    : value;

  const handleInputChange = (newVal: string) => {
    if (isUSD) {
      const usdAmount = parseInt(newVal) || 0;
      onChange((usdAmount * EXCHANGE_RATE).toString());
    } else {
      onChange(newVal);
    }
  };

  const numValue = parseInt(value.replace(/[^0-9]/g, '') || "0", 10);
  const formattedMaxPrice = formatCurrency(maxPrice, language);
  
  const error = (maxPrice !== Infinity && numValue > maxPrice) 
      ? `Current limit ${formattedMaxPrice}. Upgrade trust tier to set higher.` 
      : null;


  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      {description && (
        <p className="mb-2 text-xs text-zinc-500">{description}</p>
      )}
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-zinc-500">
          {getCurrencySymbol(language)}
        </span>
        <input
          type="number"
          required={required}
          step={step}
          className={`w-full rounded-lg border bg-white py-2.5 pl-8 pr-4 text-sm focus:outline-none focus:ring-1 dark:bg-zinc-900 transition-colors ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700"
          }`}
          placeholder={isUSD ? (parseInt(placeholder) / EXCHANGE_RATE).toString() : placeholder}
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        {maxPrice !== Infinity && (
          <div className="absolute right-3 top-2.5 flex items-center gap-1 text-xs text-zinc-400">
            <Lock className="h-3 w-3" />
            <span>Max: {formattedMaxPrice}</span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 animate-in slide-in-from-top-1 fade-in duration-200">
          <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/50">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <div className="flex-1">
              <p className="font-bold">{error}</p>
              <Link 
                href="/dashboard" 
                target="_blank"
                className="mt-1 inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <ArrowUpCircle className="h-3 w-3" />
                Go to Trust Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
