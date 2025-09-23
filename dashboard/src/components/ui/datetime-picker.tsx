"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import React from "react";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export function DateTimePicker({ value, onChange, className }: DateTimePickerProps) {
  const onDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    const newDateTime = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      value.getHours(),
      value.getMinutes(),
      value.getSeconds()
    );
    onChange(newDateTime);
  };

  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":");
    const newDateTime = new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      parseInt(hours),
      parseInt(minutes),
      0
    );
    onChange(newDateTime);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP HH:mm:ss") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onDateChange}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <input type="time" onChange={onTimeChange} value={format(value, "HH:mm")} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
