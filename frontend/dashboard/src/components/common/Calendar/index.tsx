import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as UICalendar } from "@/components/ui/calendar";
import { SelectSingleEventHandler } from "react-day-picker";

type CalendarProps = {
  date: Date | undefined;
  setter?: (date: Date) => void;
};

const Calendar = ({ date, setter = () => {} }: CalendarProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => setIsCalendarOpen(isOpen);

  const closePopover = () => setIsCalendarOpen(false);

  const handlePickDay = ((date: Date | null) => {
    if (date) {
      setter(date);
      closePopover();
    }
  }) as SelectSingleEventHandler;

  return (
    <>
      <Label htmlFor="date">Fecha</Label>
      <Popover open={isCalendarOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start font-normal"
            style={{ borderRadius: "0.375rem" }}
          >
            <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
            {date ? date.toLocaleDateString() : "Selecciona una fecha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <UICalendar mode="single" selected={date} onSelect={handlePickDay} />
        </PopoverContent>
      </Popover>
    </>
  );
};

function CalendarDaysIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

export default Calendar;
