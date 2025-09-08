"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClockIcon, XIcon } from "lucide-react";

interface TimePicker24Props {
  value?: string; // "HH:MM"
  onChange: (time: string) => void;
  interval?: number;
  minTime?: string; // restrict selection to be after this
}

const TimePicker24 = ({
  value,
  onChange,
  interval = 5,
  minTime,
}: TimePicker24Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedHour, setSelectedHour] = useState<number | null>(() => {
    const [h] = value?.split(":") ?? [];
    return h !== undefined ? parseInt(h) : null;
  });

  const [selectedMinute, setSelectedMinute] = useState<number | null>(() => {
    const [, m] = value?.split(":") ?? [];
    return m !== undefined ? parseInt(m) : null;
  });

  const minuteRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 / interval }, (_, i) => i * interval);

  const minTotalMinutes = useMemo(() => {
    if (!minTime) return null;
    const [h, m] = minTime.split(":").map(Number);
    return h * 60 + m;
  }, [minTime]);

  const isDisabled = (h: number, m: number) => {
    if (minTotalMinutes === null) return false;
    return h * 60 + m < minTotalMinutes;
  };

  const tryCloseDropdown = (
    newHour: number | null,
    newMinute: number | null
  ) => {
    if (newHour !== null && newMinute !== null) {
      const total = `${String(newHour).padStart(2, "0")}:${String(
        newMinute
      ).padStart(2, "0")}`;
      onChange(total);
      setIsOpen(false);
    }
  };

  const handleSelect = (type: "hours" | "minutes", val: number) => {
    if (type === "hours") {
      const valid = !isDisabled(val, selectedMinute ?? 0);
      if (valid) {
        setSelectedHour(val);
        setTimeout(
          () => minuteRef.current?.scrollIntoView({ behavior: "smooth" }),
          50
        );
        tryCloseDropdown(val, selectedMinute);
      }
    } else {
      const valid = !isDisabled(selectedHour ?? 0, val);
      if (valid) {
        setSelectedMinute(val);
        tryCloseDropdown(selectedHour, val);
      }
    }
  };

  const clearSelection = () => {
    setSelectedHour(null);
    setSelectedMinute(null);
    onChange("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const display =
    selectedHour !== null && selectedMinute !== null
      ? `${String(selectedHour).padStart(2, "0")}:${String(
          selectedMinute
        ).padStart(2, "0")}`
      : "Select time";

  return (
    <div className="relative w-full max-w-[200px]" onKeyDown={handleKeyDown}>
      {/* Display Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center px-3 py-2 border rounded-md bg-white shadow-sm text-sm cursor-pointer hover:border-blue-500 transition"
      >
        <div className="flex gap-2 items-center">
          <ClockIcon className="h-5 w-5 text-blue-500" />
          <span className="text-gray-800">{display}</span>
        </div>
        {value ? (
          <XIcon
            className="h-4 w-4 text-gray-400 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
          />
        ) : (
          <svg
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-20"
          >
            <div className="grid grid-cols-2 gap-2 p-2 text-center">
              {/* Hours */}
              <div className="max-h-60 overflow-y-auto pr-1">
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleSelect("hours", h)}
                    className={`block w-full px-2 py-1 rounded text-sm ${
                      isDisabled(h, selectedMinute ?? 0)
                        ? "text-gray-400 cursor-not-allowed"
                        : h === selectedHour
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                    disabled={isDisabled(h, selectedMinute ?? 0)}
                  >
                    {String(h).padStart(2, "0")}
                  </button>
                ))}
              </div>

              {/* Minutes */}
              <div className="max-h-60 overflow-y-auto pl-1" ref={minuteRef}>
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelect("minutes", m)}
                    className={`block w-full px-2 py-1 rounded text-sm ${
                      isDisabled(selectedHour ?? 0, m)
                        ? "text-gray-400 cursor-not-allowed"
                        : m === selectedMinute
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                    disabled={isDisabled(selectedHour ?? 0, m)}
                  >
                    {String(m).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimePicker24;
