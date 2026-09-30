-- ---------------------------------------------------------
-- Los pedidos y sus items ahora los crea solo el servidor
-- (/api/checkout, con la service key), que calcula los precios
-- desde la tabla productos.
--
-- Antes cualquier usuario logueado podía insertar un pedido
-- directo en Supabase con el estado y el total que quisiera
-- (por ejemplo, uno ya "pagado"). Esto le saca ese permiso.
--
-- Ejecutalo una sola vez en Supabase → SQL Editor.
-- ---------------------------------------------------------

drop policy if exists "Los usuarios crean sus propios pedidos" on public.pedidos;

drop policy if exists "Los usuarios crean items en sus propios pedidos" on public.pedido_items;
