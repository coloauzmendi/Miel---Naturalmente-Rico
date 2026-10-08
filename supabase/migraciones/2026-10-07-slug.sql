-- ---------------------------------------------------------
-- Agrega "slug" a productos: la parte legible de la dirección
-- (/productos/croquetas-de-papa-y-mung en vez del id).
-- Se genera solo al crear el producto y no cambia si después se
-- renombra, para no romper links compartidos.
--
-- Ejecutalo una sola vez en Supabase → SQL Editor, ANTES de
-- publicar el cambio. Los slugs de los productos que ya existían
-- se cargaron aparte con un script (ver el commit que agrega este
-- archivo). Las direcciones viejas con el id dejaron de existir.
-- ---------------------------------------------------------

alter table public.productos
  add column if not exists slug text;

create unique index if not exists productos_slug_key
  on public.productos (slug);
