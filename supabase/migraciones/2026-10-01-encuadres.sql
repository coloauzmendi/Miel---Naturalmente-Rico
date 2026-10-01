-- ---------------------------------------------------------
-- Agrega "encuadres" a productos: para cada foto (por URL)
-- guarda el punto que queda en el centro y el zoom, que se
-- ajustan desde el panel con el botón "Ajustar".
-- Ejemplo: {"https://.../foto.jpg": {"x": 40, "y": 65, "zoom": 1.3}}
--
-- Ejecutalo una sola vez en Supabase → SQL Editor.
-- ---------------------------------------------------------

alter table public.productos
  add column if not exists encuadres jsonb;
