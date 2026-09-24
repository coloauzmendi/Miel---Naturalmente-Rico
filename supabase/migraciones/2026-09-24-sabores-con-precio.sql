-- ---------------------------------------------------------
-- Le agrega precio a cada sabor. Antes "sabores" era una lista de
-- nombres; ahora es una lista de {nombre, precio}.
--
-- Esto renombra la columna vieja a "sabores_legacy" (para no perder
-- los nombres que ya habías cargado) y crea una columna nueva
-- "sabores" (jsonb) vacía. Después de correr esto en Supabase,
-- avisale a Claude para que traslade los sabores existentes a la
-- columna nueva con un precio para cada uno.
--
-- Ejecutalo una sola vez en Supabase → SQL Editor.
-- ---------------------------------------------------------

alter table public.productos
  rename column sabores to sabores_legacy;

alter table public.productos
  add column if not exists sabores jsonb;
