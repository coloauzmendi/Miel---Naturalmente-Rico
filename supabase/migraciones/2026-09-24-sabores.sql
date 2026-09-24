-- ---------------------------------------------------------
-- Agrega "sabores" (variantes) a productos y pedido_items.
--
-- Ejecutalo una sola vez en Supabase → SQL Editor si tu base ya
-- estaba creada antes de este cambio.
-- ---------------------------------------------------------

alter table public.productos
  add column if not exists sabores text[];

alter table public.pedido_items
  add column if not exists sabor text;
