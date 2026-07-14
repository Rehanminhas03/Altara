import type { Vehicle } from "@/types";
import { formatMileage, humanize } from "@/lib/utils";

export function SpecTable({ vehicle }: { vehicle: Vehicle }) {
  const rows: [string, string | number | null][] = [
    ["Make", vehicle.make],
    ["Model", vehicle.model],
    ["Variant", vehicle.variant],
    ["Year", vehicle.year],
    ["Mileage", formatMileage(vehicle.mileage)],
    ["Fuel", humanize(vehicle.fuel)],
    ["Transmission", humanize(vehicle.transmission)],
    ["Engine", vehicle.engine_size ? `${vehicle.engine_size}L` : null],
    ["Power", vehicle.power_bhp ? `${vehicle.power_bhp} bhp` : null],
    ["Body type", vehicle.body_type],
    ["Doors", vehicle.doors],
    ["Seats", vehicle.seats],
    ["Colour", vehicle.colour],
    ["Registration", vehicle.reg_plate],
  ];
  const visible = rows.filter(
    ([, v]) => v !== null && v !== undefined && v !== "",
  );

  return (
    <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
      {visible.map(([label, value]) => (
        <div
          key={label}
          className="flex items-center justify-between gap-4 border-b border-hairline py-3"
        >
          <dt className="text-sm text-ink-muted">{label}</dt>
          <dd className="tnum text-right text-sm font-medium text-ink">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
