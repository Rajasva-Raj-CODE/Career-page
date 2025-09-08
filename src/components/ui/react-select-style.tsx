import { StylesConfig } from "react-select";

export const globalSelectStyles: StylesConfig<
  {
    label: string;
    value: string | number;
    data?: {
      code: string;
      name: string;
    };
  },
  false
> = {
  control: (base) => ({
    ...base,
    backgroundColor: "var(--card)",
    borderRadius: "var(--radius-md)",
    color: "var(--foreground)",
    borderColor: "var(--border)",
    minHeight: "2.5rem",
    boxShadow: "none",
    fontSize: "0.875rem",
    paddingLeft: "0.25rem",
    "&:hover": {
      borderColor: "var(--ring)",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--popover)",
    borderRadius: "var(--radius-md)",
    zIndex: 30,
    marginTop: "0.25rem",
    color: "var(--popover-foreground)",
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "120px",
    overflowY: "auto",
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--muted)" : "var(--popover)",
    color: "var(--popover-foreground)",
    padding: "8px 12px",
    fontSize: "14px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--foreground)",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--muted)",
    borderRadius: "0.375rem",
    padding: "0 4px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "var(--foreground)",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "var(--foreground)",
    ":hover": {
      backgroundColor: "var(--destructive)",
      color: "#fff",
    },
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--foreground)",
    "&:hover": {
      color: "var(--foreground)",
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "var(--foreground)",
    "&:hover": {
      color: "var(--destructive)",
    },
  }),
  input: (base) => ({
    ...base,
    color: "var(--foreground)", // Ensures input (search text) is visible
  }),

  placeholder: (base) => ({
    ...base,
    color: "var(--muted-foreground)", // Slightly lighter for placeholder
  }),
};
export const multiglobalSelectStyles: StylesConfig<
  {
    label: string;
    value: number;
  },
  true
> = {
  control: (base) => ({
    ...base,
    backgroundColor: "var(--card)",
    borderRadius: "var(--radius-md)",
    color: "var(--foreground)",
    borderColor: "var(--border)",
    minHeight: "2.5rem",
    boxShadow: "none",
    fontSize: "0.875rem",
    paddingLeft: "0.25rem",
    "&:hover": {
      borderColor: "var(--ring)",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--popover)",
    borderRadius: "var(--radius-md)",
    zIndex: 30,
    marginTop: "0.25rem",
    color: "var(--popover-foreground)",
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "180px",
    overflowY: "auto",
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--muted)" : "var(--popover)",
    color: "var(--popover-foreground)",
    padding: "8px 12px",
    fontSize: "14px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--foreground)",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--muted)",
    borderRadius: "0.375rem",
    padding: "0 4px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "var(--foreground)",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "var(--foreground)",
    ":hover": {
      backgroundColor: "var(--destructive)",
      color: "#fff",
    },
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--foreground)",
    "&:hover": {
      color: "var(--foreground)",
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "var(--foreground)",
    "&:hover": {
      color: "var(--destructive)",
    },
  }),
  input: (base) => ({
    ...base,
    color: "var(--foreground)", // Ensures input (search text) is visible
  }),

  placeholder: (base) => ({
    ...base,
    color: "var(--muted-foreground)", // Slightly lighter for placeholder
  }),
};

export const CalendarSelectStyles: StylesConfig<
  { label: string; value: string | number },
  false
> = {
  control: (base) => ({
    ...base,
    backgroundColor: "var(--card)",
    borderRadius: "var(--radius-md)",
    borderColor: "var(--border)",
    minHeight: "2rem", // reduced from 2.5rem
    height: "2rem",
    fontSize: "0.75rem", // smaller text
    paddingLeft: "0.25rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "var(--ring)",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 6px",
    height: "2rem",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "2rem",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "4px",
    fontSize: "10px",
    color: "var(--foreground)",
    "&:hover": {
      color: "var(--foreground)",
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: "4px",
    fontSize: "14px",
    color: "var(--foreground)",
    "&:hover": {
      color: "var(--destructive)",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--popover)",
    borderRadius: "var(--radius-md)",
    zIndex: 30,
    marginTop: "0.25rem",
    color: "var(--popover-foreground)",
    fontSize: "0.75rem",
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "200px",
    overflowY: "auto",
    borderRadius: "var(--radius-md)",
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--muted)" : "var(--popover)",
    color: "var(--popover-foreground)",
    padding: "6px 10px",
    fontSize: "0.75rem",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--foreground)",
    fontSize: "0.75rem",
  }),
  input: (base) => ({
    ...base,
    color: "var(--foreground)",
    fontSize: "0.75rem",
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--muted-foreground)",
    fontSize: "0.75rem",
  }),
};
