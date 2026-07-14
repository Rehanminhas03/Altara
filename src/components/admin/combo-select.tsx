"use client";

import { useState } from "react";
import { Select, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const OTHER = "__other__";

/**
 * A dropdown that also allows a custom value: picking "Other…" swaps to a text
 * input. Controlled — pair with react-hook-form's Controller.
 */
export function ComboSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
}: {
  value: string;
  onChange: (v: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
}) {
  const known = options.map((o) => o.value);
  const [other, setOther] = useState(
    () => Boolean(value) && !known.includes(value),
  );

  if (other) {
    return (
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a custom value"
          autoFocus
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setOther(false);
            onChange("");
          }}
        >
          List
        </Button>
      </div>
    );
  }

  return (
    <Select
      value={known.includes(value) ? value : ""}
      onChange={(e) => {
        if (e.target.value === OTHER) {
          setOther(true);
          onChange("");
        } else {
          onChange(e.target.value);
        }
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
      <option value={OTHER}>Other…</option>
    </Select>
  );
}
