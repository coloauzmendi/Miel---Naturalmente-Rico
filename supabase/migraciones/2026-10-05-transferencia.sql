-- ---------------------------------------------------------
-- Agrega "transferencia" como método de pago de los pedidos.
--
-- Ejecutalo una sola vez en Supabase → SQL Editor, ANTES de
-- publicar el cambio del checkout (si no, los pedidos por
-- transferencia van a dar error al crearse).
-- ---------------------------------------------------------

alter table public.pedidos
  drop constraint if exists pedidos_metodo_pago_check;

alter table public.pedidos
  add constraint pedidos_metodo_pago_check
  check (metodo_pago in ('mercadopago', 'efectivo', 'transferencia'));
