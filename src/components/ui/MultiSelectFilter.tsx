import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {Popover, PopoverTrigger, PopoverContent,} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectFilter({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectDropdownProps) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const selectedLabels =
    options
      .filter((opt) => selected.includes(opt.value))
      .map((opt) => opt.label)
      .join(", ") || placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{selectedLabels}</span>
          <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-64 overflow-y-auto p-1 rounded-md shadow-md border bg-card">
        {options.map((option) => {
          const isChecked = selected.includes(option.value);
          return (
            <button
              type="button"
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className="flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-muted focus:outline-none"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => handleToggle(option.value)}
                className="mr-2"
                id={`checkbox-${option.value}`}
              />
              <label htmlFor={`checkbox-${option.value}`} className="flex-1 text-left">
                {option.label}
              </label>
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
