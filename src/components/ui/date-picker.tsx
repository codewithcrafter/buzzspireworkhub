"use client"

import * as React from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  date?: Date
  onDateChange: (date: Date) => void
  label?: string
}

function DatePicker({ date, onDateChange, label = "Pick a date" }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date())
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // Days in month calculation
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Day of the week of first date
  const firstDayIndex = new Date(year, month, 1).getDay()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const handleDateSelect = (day: number) => {
    const selected = new Date(year, month, day)
    onDateChange(selected)
    setIsOpen(false)
  }

  const daysGrid = []
  // Empty slots for preceding month days offset
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(<div key={`empty-${i}`} className="size-8" />)
  }

  // Days fill
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = date && date.getDate() === day && date.getMonth() === month && date.getFullYear() === year
    const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year

    daysGrid.push(
      <button
        key={`day-${day}`}
        onClick={() => handleDateSelect(day)}
        className={cn(
          "size-8 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all hover:bg-primary/10 hover:text-primary",
          isSelected && "bg-primary text-white hover:bg-primary hover:text-white shadow-sm",
          isToday && !isSelected && "border border-primary/40 text-primary"
        )}
      >
        {day}
      </button>
    )
  }

  const formattedDate = date ? date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }) : null

  return (
    <div className="relative inline-block text-left select-none" ref={containerRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer font-medium"
      >
        <CalendarIcon className="size-4 text-muted-foreground" />
        <span>{formattedDate || label}</span>
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-64 z-50 bg-card border border-border/80 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
            <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer">
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-xs font-bold font-heading text-foreground">
              {monthNames[month]} {year}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer">
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase font-bold text-muted-foreground/60 mb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1 justify-items-center">
            {daysGrid}
          </div>
        </div>
      )}
    </div>
  )
}

export { DatePicker }
export type { DatePickerProps }
