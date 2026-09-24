-- ---------------------------------------------------------
-- Agrega "imagenes" (varias fotos por producto) a productos.
-- imagen_url sigue existiendo y queda como la portada (la primera foto).
--
-- Ejecutalo una sola vez en Supabase → SQL Editor si tu base ya
-- estaba creada antes de este cambio.
-- ---------------------------------------------------------

alter table public.productos
  add column if not exists imagenes text[];


