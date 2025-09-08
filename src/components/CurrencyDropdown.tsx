// components/form/CurrencySelect.tsx
import Select from "react-select";
import { FormControl } from "@/components/ui/form";
import { globalSelectStyles } from "./ui/react-select-style";

interface CurrencySelectProps {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
  allCurrencyCodes: string[];
  placeholder?: string;
}

export function CurrencySelect({
  field,
  allCurrencyCodes,
  placeholder = "Select Currency",
}: CurrencySelectProps) {
  const currencyOptions = allCurrencyCodes.map((code) => ({
    label: code,
    value: code,
  }));

  return (
    <FormControl>
      <Select
        options={currencyOptions}
        value={currencyOptions.find((opt) => opt.value === field.value)}
        onChange={(option) => field.onChange((option?.value as string) || "")}
        isClearable
        placeholder={placeholder}
        className="w-full text-sm"
        classNamePrefix="react-select"
        styles={globalSelectStyles}
      />
    </FormControl>
  );
}
