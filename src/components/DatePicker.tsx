"use client"

import * as React from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  minDate?: Date
  maxDate?: Date
  className?: string
  placeholder?: string
  language?: "ja" | "en"
}

export function DatePicker({ 
  date, 
  setDate, 
  minDate, 
  maxDate,
  className, 
  placeholder = "Pick a date",
  language = "en"
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const formatDate = (d: Date) => {
    if (language === "ja") {
      return format(d, "yyyy年MM月dd日", { locale: ja })
    }
    return format(d, "PPP")
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          className={cn(
            "w-full justify-start text-left font-normal flex items-center gap-2 rounded-lg border border-zinc-300 bg-white py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900",
            !date && "text-zinc-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>{placeholder}</span>}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="z-50 w-auto rounded-md border border-zinc-200 bg-white p-0 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950"
          align="start"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate)
              setOpen(false)
            }}
            locale={language === "ja" ? ja : undefined}
            captionLayout="dropdown-buttons"
            fromYear={minDate ? minDate.getFullYear() : new Date().getFullYear()}
            toYear={maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 1}
            disabled={(day) => {
              // Normalize dates to start of day for accurate comparison
              const dayTime = new Date(day).setHours(0, 0, 0, 0)
              
              if (minDate) {
                const minTime = new Date(minDate).setHours(0, 0, 0, 0)
                if (dayTime < minTime) return true
              }
              
              if (maxDate) {
                const maxTime = new Date(maxDate).setHours(0, 0, 0, 0)
                if (dayTime > maxTime) return true
              }
              
              return false
            }}
            initialFocus
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
