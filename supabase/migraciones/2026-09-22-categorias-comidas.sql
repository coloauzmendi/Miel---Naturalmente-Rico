-- ---------------------------------------------------------
-- Cambia las categorías de productos:
--   antes:  'cocidos' | 'congelados'
--   ahora:  'almuerzos-cenas' | 'desayunos-meriendas'
--
-- Ejecutalo una sola vez en Supabase → SQL Editor si tu base ya
-- estaba creada con el schema anterior. Los productos que existan
-- pasan a "Almuerzos y cenas"; después, desde /admin/productos,
-- cambiá a "Desayunos y meriendas" los que correspondan.
-- ---------------------------------------------------------

alter table public.productos
  drop constraint if exists productos_categoria_check;

update public.productos
  set categoria = 'almuerzos-cenas'
  where categoria not in ('almuerzos-cenas', 'desayunos-meriendas');

alter table public.productos
  add constraint productos_categoria_check
  check (categoria in ('almuerzos-cenas', 'desayunos-meriendas'));
