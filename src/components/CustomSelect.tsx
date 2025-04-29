"use client";

import { Template } from "@/types/api";
import { Menu } from "@/types/menu";
import {
  ControllerRenderProps,
  FieldValues,
  FieldErrors,
} from "react-hook-form";

interface Option {
  id: number;
  name: string;
}

interface CustomSelectProps<T extends FieldValues> {
  field: ControllerRenderProps<T>;
  errors: FieldErrors<T>;
  template?: Template | null;
  options: { id: number; name: string }[];
  selectStyle?: React.CSSProperties;
  placeholder?: string;
  errorField?: keyof T;
}

export function CustomSelect<T extends FieldValues>({
  field,
  errors,
  template,
  options,
  selectStyle,
  placeholder = "선택",
  errorField = "targetId" as keyof T,
}: CustomSelectProps<T>) {
  return (
    <select
      {...field}
      className="custom-select"
      style={{
        ...selectStyle,
        borderColor: errors[errorField]
          ? "var(--chakra-colors-red-500)"
          : "inherit",
      }}
      disabled={template?.id === -1}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
