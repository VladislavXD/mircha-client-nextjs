import React from "react";
import { useController, Control, FieldValues, Path } from "react-hook-form";

import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  control: Control<T, any, T>;
  required?: string;
  endContent?: JSX.Element;
};

const Input = <T extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  type,
  control,
  required = "",
  endContent,
}: Props<T>) => {
  const {
    field,
    fieldState: { invalid, error },
    formState: { errors },
  } = useController({
    name,
    control,
    rules: {
      required,
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <ShadcnInput
          className={invalid ? "border-red-500" : ""}
          disabled={false}
          id={name}
          name={field.name}
          placeholder={placeholder}
          type={type}
          value={field.value || ""}
          onBlur={field.onBlur}
          onChange={field.onChange}
        />
        {endContent && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {endContent}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error.message}</span>}
    </div>
  );
};

export default Input;
