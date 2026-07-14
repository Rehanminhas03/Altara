"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Check } from "lucide-react";
import { Input, Textarea, Select, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ComboSelect } from "./combo-select";
import {
  vehicleFormSchema,
  type VehicleFormValues,
} from "@/lib/validators/vehicle";
import { createVehicle, updateVehicle } from "@/lib/actions/admin";
import { BODY_TYPES, FUEL_TYPES, TRANSMISSIONS } from "@/lib/constants";
import type { Vehicle } from "@/types";

export function VehicleForm({
  mode,
  vehicle,
  makeSuggestions = [],
  modelSuggestions = [],
}: {
  mode: "create" | "edit";
  vehicle?: Vehicle;
  makeSuggestions?: string[];
  modelSuggestions?: string[];
}) {
  const router = useRouter();
  const [features, setFeatures] = useState<string[]>(vehicle?.features ?? []);
  const [featureInput, setFeatureInput] = useState("");
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: vehicle
      ? {
          title: vehicle.title,
          make: vehicle.make,
          model: vehicle.model,
          variant: vehicle.variant ?? "",
          year: vehicle.year,
          mileage: vehicle.mileage,
          fuel: vehicle.fuel,
          transmission: vehicle.transmission,
          engine_size: vehicle.engine_size ?? undefined,
          power_bhp: vehicle.power_bhp ?? undefined,
          colour: vehicle.colour ?? "",
          body_type: vehicle.body_type,
          doors: vehicle.doors ?? undefined,
          seats: vehicle.seats ?? undefined,
          price: vehicle.price,
          previous_price: vehicle.previous_price ?? undefined,
          description: vehicle.description ?? "",
          status: vehicle.status,
          featured: vehicle.featured,
          reg_plate: vehicle.reg_plate ?? "",
          slug: vehicle.slug,
        }
      : { status: "available", featured: false, fuel: "petrol", transmission: "automatic" },
  });

  const addFeature = () => {
    const f = featureInput.trim();
    if (f && !features.includes(f)) setFeatures((prev) => [...prev, f]);
    setFeatureInput("");
  };

  async function onSubmit(values: VehicleFormValues) {
    setServerError("");
    setSaved(false);
    const payload = { ...values, features };
    const res =
      mode === "create"
        ? await createVehicle(payload)
        : await updateVehicle(vehicle!.id, payload);

    if (!res.ok) {
      setServerError(res.error);
      return;
    }
    if (mode === "create" && res.data && "id" in res.data) {
      router.push(`/admin/vehicles/${res.data.id}/edit`);
    } else {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
      <Section title="Identity">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title" error={errors.title?.message} required help="Without the year, e.g. “BMW M340i xDrive”">
            <Input {...register("title")} />
          </Field>
          <Field label="Slug" error={errors.slug?.message} help="Leave blank to auto-generate">
            <Input {...register("slug")} placeholder="auto" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Make" error={errors.make?.message} required>
            <Input {...register("make")} list="admin-makes" placeholder="e.g. BMW" />
            <datalist id="admin-makes">
              {makeSuggestions.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </Field>
          <Field label="Model" error={errors.model?.message} required>
            <Input {...register("model")} list="admin-models" placeholder="e.g. 3 Series" />
            <datalist id="admin-models">
              {modelSuggestions.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </Field>
          <Field label="Variant" error={errors.variant?.message}>
            <Input {...register("variant")} />
          </Field>
        </div>
      </Section>

      <Section title="Key figures">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Year" error={errors.year?.message} required>
            <Input type="number" {...register("year")} />
          </Field>
          <Field label="Mileage" error={errors.mileage?.message} required>
            <Input type="number" {...register("mileage")} />
          </Field>
          <Field label="Registration plate" error={errors.reg_plate?.message}>
            <Input {...register("reg_plate")} placeholder="72 reg" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Price (£)" error={errors.price?.message} required>
            <Input type="number" step="1" {...register("price")} />
          </Field>
          <Field label="Previous price (£)" error={errors.previous_price?.message} help="For “was / now” pricing">
            <Input type="number" step="1" {...register("previous_price")} />
          </Field>
        </div>
      </Section>

      <Section title="Specification">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Fuel" error={errors.fuel?.message} required help="Pick one or choose Other to type a custom value">
            <Controller
              name="fuel"
              control={control}
              render={({ field }) => (
                <ComboSelect
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  options={FUEL_TYPES}
                  placeholder="Select fuel"
                />
              )}
            />
          </Field>
          <Field label="Transmission" error={errors.transmission?.message} required>
            <Controller
              name="transmission"
              control={control}
              render={({ field }) => (
                <ComboSelect
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  options={TRANSMISSIONS}
                  placeholder="Select transmission"
                />
              )}
            />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-4">
          <Field label="Engine (L)" error={errors.engine_size?.message}>
            <Input type="number" step="0.1" {...register("engine_size")} />
          </Field>
          <Field label="Power (bhp)" error={errors.power_bhp?.message}>
            <Input type="number" {...register("power_bhp")} />
          </Field>
          <Field label="Doors" error={errors.doors?.message}>
            <Input type="number" {...register("doors")} />
          </Field>
          <Field label="Seats" error={errors.seats?.message}>
            <Input type="number" {...register("seats")} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Body type" error={errors.body_type?.message} required help="Pick one or choose Other to type a custom value">
            <Controller
              name="body_type"
              control={control}
              render={({ field }) => (
                <ComboSelect
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  options={BODY_TYPES.map((b) => ({ value: b, label: b }))}
                  placeholder="Select body type"
                />
              )}
            />
          </Field>
          <Field label="Colour" error={errors.colour?.message}>
            <Input {...register("colour")} />
          </Field>
        </div>
      </Section>

      <Section title="Features">
        <div className="flex gap-2">
          <Input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
            placeholder="Add a feature and press Enter"
          />
          <Button type="button" variant="ghost" onClick={addFeature}>
            <Plus className="h-4 w-4" aria-hidden />
            Add
          </Button>
        </div>
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {features.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-steel px-3 py-1 text-sm text-ink"
              >
                {f}
                <button
                  type="button"
                  onClick={() => setFeatures((p) => p.filter((x) => x !== f))}
                  aria-label={`Remove ${f}`}
                  className="text-ink-faint hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </span>
            ))}
          </div>
        )}
      </Section>

      <Section title="Description">
        <Field label="Description" error={errors.description?.message}>
          <Textarea rows={6} {...register("description")} />
        </Field>
      </Section>

      <Section title="Status">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Availability" error={errors.status?.message}>
            <Select {...register("status")}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </Select>
          </Field>
          <label className="flex items-center gap-3 self-end pb-3 text-sm text-ink">
            <input
              type="checkbox"
              {...register("featured")}
              className="h-4 w-4 rounded border-hairline bg-steel accent-accent"
            />
            Feature on the homepage
          </label>
        </div>
      </Section>

      {serverError && <p className="text-sm text-red-400">{serverError}</p>}

      <div className="flex items-center gap-3 border-t border-hairline pt-6">
        <Button type="submit" variant="chrome" size="lg" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : mode === "create"
              ? "Create vehicle"
              : "Save changes"}
        </Button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
            <Check className="h-4 w-4" aria-hidden />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
        {title}
      </h2>
      {children}
    </section>
  );
}
