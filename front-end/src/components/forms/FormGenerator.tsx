// components/forms/FormGenerator.tsx
import React from "react";
import clsx from "clsx";

interface Field {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  options?: { label: string; value: any }[];
  disabled?: boolean;
  label?: string; // Propriedade opcional de label
}

interface FormGeneratorProps {
  fields: Field[];
  form: Record<any, any>;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  className: string;
}

export default function FormGenerator({ fields, form, setForm, className }: FormGeneratorProps) {
  return (
    <div className={clsx(className)}>
      {fields.map((field) => {
        const value = form[field.name] ?? "";

        const inputElement = field.type === "select" ? (
          <select
            value={value}
            onChange={(e) => {
              const val = field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value;
              setForm({ ...form, [field.name]: val });
            }}
            disabled={field.disabled}
            className="border border-gray-300 p-2 bg-ice text-black-smooth rounded-md w-full outline-none focus:border-primary-orange transition-colors"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => {
              const val = field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value;
              setForm({ ...form, [field.name]: val });
            }}
            required={field.required}
            disabled={field.disabled}
            className={`appearance-none border border-gray-300 p-2 rounded-md w-full outline-none focus:border-primary-orange transition-colors ${
              field.disabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-ice text-black-smooth"
            }`}
          />
        );

        return (
          <div key={field.name} className="flex flex-col gap-1.5 w-full">
            {field.label && (
              <label className="text-sm font-semibold text-white/80 select-none text-start">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {inputElement}
          </div>
        );
      })}
    </div>
  );
}
