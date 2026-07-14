"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select, Field } from "@/components/ui/input";
import {
  BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSIONS,
  MAKES,
} from "@/lib/constants";
import type { InventoryFacets } from "@/lib/queries";
import { formatPrice, formatNumber } from "@/lib/utils";

const CURRENT_YEAR = 2026;
const PRICE_STEPS = [
  5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000,
];
const MILEAGE_STEPS = [10000, 20000, 30000, 50000, 75000, 100000];
const YEARS = Array.from({ length: 12 }, (_, i) => CURRENT_YEAR - i);

export function FilterPanel({ facets }: { facets: InventoryFacets }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (k: string) => searchParams.get(k) ?? "";
  const makeModel = facets.makeModel;
  const makes = Object.keys(makeModel).length
    ? Object.keys(makeModel)
    : [...MAKES];
  const selectedMake = get("make");
  const models = selectedMake ? (makeModel[selectedMake] ?? []) : [];

  // Show only options that exist in live stock; fall back to the full set
  // before any inventory is added.
  const bodyTypes = facets.bodyTypes.length ? facets.bodyTypes : [...BODY_TYPES];
  const fuelOptions = facets.fuels.length
    ? facets.fuels.map((v) => ({
        value: v,
        label: FUEL_TYPES.find((f) => f.value === v)?.label ?? v,
      }))
    : FUEL_TYPES;
  const transOptions = facets.transmissions.length
    ? facets.transmissions.map((v) => ({
        value: v,
        label: TRANSMISSIONS.find((t) => t.value === v)?.label ?? v,
      }))
    : TRANSMISSIONS;

  const setParams = (patch: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (!v) params.delete(k);
      else params.set(k, v);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-5">
      <Field label="Make">
        <Select
          value={selectedMake}
          onChange={(e) => setParams({ make: e.target.value, model: "" })}
        >
          <option value="">Any make</option>
          {makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Model">
        <Select
          value={get("model")}
          disabled={!selectedMake || models.length === 0}
          onChange={(e) => setParams({ model: e.target.value })}
        >
          <option value="">
            {selectedMake ? "Any model" : "Select a make first"}
          </option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Body type">
        <Select value={get("body")} onChange={(e) => setParams({ body: e.target.value })}>
          <option value="">Any body</option>
          {bodyTypes.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Min price">
          <Select
            value={get("priceMin")}
            onChange={(e) => setParams({ priceMin: e.target.value })}
          >
            <option value="">No min</option>
            {PRICE_STEPS.map((p) => (
              <option key={p} value={p}>
                {formatPrice(p)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Max price">
          <Select
            value={get("priceMax")}
            onChange={(e) => setParams({ priceMax: e.target.value })}
          >
            <option value="">No max</option>
            {PRICE_STEPS.map((p) => (
              <option key={p} value={p}>
                {formatPrice(p)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Year from">
          <Select
            value={get("yearMin")}
            onChange={(e) => setParams({ yearMin: e.target.value })}
          >
            <option value="">Any</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Year to">
          <Select
            value={get("yearMax")}
            onChange={(e) => setParams({ yearMax: e.target.value })}
          >
            <option value="">Any</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Max mileage">
        <Select
          value={get("mileageMax")}
          onChange={(e) => setParams({ mileageMax: e.target.value })}
        >
          <option value="">Any mileage</option>
          {MILEAGE_STEPS.map((m) => (
            <option key={m} value={m}>
              Under {formatNumber(m)} miles
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Fuel">
        <Select value={get("fuel")} onChange={(e) => setParams({ fuel: e.target.value })}>
          <option value="">Any fuel</option>
          {fuelOptions.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Transmission">
        <Select
          value={get("transmission")}
          onChange={(e) => setParams({ transmission: e.target.value })}
        >
          <option value="">Any transmission</option>
          {transOptions.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  );
}
