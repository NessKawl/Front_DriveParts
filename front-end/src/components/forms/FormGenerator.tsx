// components/forms/FormGenerator.tsx
import React from "react";
import clsx from "clsx";
interface Field {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  options?: { label: string; value: string }[]; // usado para selects
}

interface FormGeneratorProps {
  fields: Field[];
  form: Record<string, string>;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  className: string;
}

export default function FormGenerator({ fields, form, setForm, className }: FormGeneratorProps) {
  return (
    <div className={clsx(className)}>
      {fields.map((field) => {
        if (field.type === "select") {
          return (
            <select
              key={field.name}
              value={form[field.name]}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              className="border border-gray-300 p-2 bg-ice text-black-smooth rounded-md col-span-2"
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        }

        return (
          <input
            key={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
            required={field.required}
            className="appearance-none border border-gray-300 p-2 bg-ice text-black-smooth rounded-md"
          />
        );
      })}
    </div>
  );
}
