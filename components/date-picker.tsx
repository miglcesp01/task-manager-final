"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  error?: string | null
}

export function DatePicker({ date, onDateChange, error }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Close the popover when the date is selected
  const handleSelect = (newDate: Date | undefined) => {
    onDateChange(newDate)
    setOpen(false)
  }

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal focus-visible:ring-0 focus-visible:ring-offset-0",
              !date && "text-muted-foreground",
              error ? "border-red-500" : "",
            )}
            onClick={(e) => {
              e.stopPropagation()
              setOpen(true)
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MMM d, yyyy") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" onClick={(e) => e.stopPropagation()}>
          <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

