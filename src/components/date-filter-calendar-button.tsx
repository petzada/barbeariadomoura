"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type DateFilterCalendarButtonProps = {
  value: Date;
  onChange: (date: Date) => void;
  markedDates?: string[];
  title?: string;
  minDate?: Date;
  maxDate?: Date;
};

export function DateFilterCalendarButton({
  value,
  onChange,
  markedDates = [],
  title = "Selecionar data",
  minDate,
  maxDate,
}: DateFilterCalendarButtonProps) {
  const [open, setOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(startOfMonth(value));

  const markedSet = useMemo(() => new Set(markedDates), [markedDates]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const gridStart = startOfWeek(monthStart, { locale: ptBR });
    const gridEnd = endOfWeek(monthEnd, { locale: ptBR });

    const days: Date[] = [];
    let cursor = gridStart;
    while (cursor <= gridEnd) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return days;
  }, [displayMonth]);

  const isDisabled = (day: Date) => {
    if (minDate && isBefore(day, startOfDay(minDate))) {
      return true;
    }
    if (maxDate && isAfter(day, startOfDay(maxDate))) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          setDisplayMonth(startOfMonth(value));
          setOpen(true);
        }}
      >
        <CalendarIcon className="h-4 w-4" />
        <span className="sr-only">Abrir calendario</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDisplayMonth((prev) => subMonths(prev, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Mes anterior</span>
              </Button>
              <p className="font-medium capitalize">
                {format(displayMonth, "MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDisplayMonth((prev) => addMonths(prev, 1))}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Proximo mes</span>
              </Button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const iso = format(day, "yyyy-MM-dd");
                const selected = isSameDay(day, value);
                const currentMonth = isSameMonth(day, displayMonth);
                const hasEvents = markedSet.has(iso);
                const disabled = isDisabled(day);

                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onChange(day);
                      setOpen(false);
                    }}
                    className={cn(
                      "relative h-10 rounded-md text-sm transition-colors",
                      selected && "bg-primary text-primary-foreground font-medium",
                      !selected && currentMonth && "hover:bg-secondary",
                      !currentMonth && "text-muted-foreground/50",
                      disabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    {format(day, "d")}
                    {hasEvents && currentMonth && (
                      <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
