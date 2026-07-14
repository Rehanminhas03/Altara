-- Relax fuel + transmission from enums to free text so the admin can enter
-- custom values ("Other"). body_type is already text. Idempotent.
alter table public.vehicles
  alter column fuel type text using fuel::text;

alter table public.vehicles
  alter column transmission type text using transmission::text;
