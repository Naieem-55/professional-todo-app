"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
  date?: Date | null
  setDate: (date: Date | null) => void
  disabled?: boolean
  placeholder?: string
}

export function DateTimePicker({
  date,
  setDate,
  disabled,
  placeholder = "Pick a date and time",
}: DateTimePickerProps) {
  // Helper function to safely convert to Date
  const toDate = (value: Date | null | undefined): Date | undefined => {
    if (!value) return undefined
    const d = value instanceof Date ? value : new Date(value)
    return isNaN(d.getTime()) ? undefined : d
  }

  const validDate = toDate(date)

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    validDate
  )
  const [timeValue, setTimeValue] = React.useState<string>(
    validDate ? format(validDate, "HH:mm") : "09:00"
  )
  const [isOpen, setIsOpen] = React.useState(false)

  // Sync with prop changes
  React.useEffect(() => {
    const newValidDate = toDate(date)
    setSelectedDate(newValidDate)
    if (newValidDate) {
      setTimeValue(format(newValidDate, "HH:mm"))
    }
  }, [date])

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return

    // Preserve the time when selecting a new date
    const [hours, minutes] = timeValue.split(':').map(Number)
    newDate.setHours(hours, minutes, 0, 0)

    setSelectedDate(newDate)
    setDate(newDate)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTimeValue(newTime)

    if (selectedDate) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const newDate = new Date(selectedDate)
      newDate.setHours(hours, minutes, 0, 0)
      setSelectedDate(newDate)
      setDate(newDate)
    }
  }

  const handleClear = () => {
    setSelectedDate(undefined)
    setDate(null)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !validDate && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {validDate ? (
            <span className="flex items-center gap-2">
              {format(validDate, "PPP")}
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                {format(validDate, "HH:mm")}
              </span>
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <Label htmlFor="time" className="text-xs text-muted-foreground mb-2 block">
            Select Date & Time
          </Label>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="time" className="text-sm">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              className="flex-1 h-8"
              disabled={!selectedDate}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={!selectedDate}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
