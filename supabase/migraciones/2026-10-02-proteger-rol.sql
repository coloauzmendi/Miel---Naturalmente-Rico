-- ---------------------------------------------------------
-- SEGURIDAD: que nadie pueda hacerse administrador solo.
--
-- La política "Los usuarios actualizan su propio perfil" dejaba
-- cambiar cualquier columna del propio perfil, incluida "rol":
-- cualquier cliente registrado podía ponerse rol = 'admin' desde
-- el navegador y entrar al panel.
--
-- 1. Los usuarios solo pueden modificar nombre y teléfono.
-- 2. Además, la base rechaza cualquier cambio de rol que no venga
--    del SQL Editor de Supabase o de la service key (el servidor).
--
-- Ejecutalo una sola vez en Supabase → SQL Editor.
-- ---------------------------------------------------------

revoke update on public.perfiles from anon, authenticated;
grant update (nombre, telefono) on public.perfiles to authenticated;

create or replace function public.proteger_rol()
returns trigger as $$
begin
  if new.rol is distinct from old.rol
     and coalesce(auth.role(), '') <> 'service_role'
     and current_user not in ('postgres', 'supabase_admin') then
    raise exception 'No se puede cambiar el rol desde la tienda';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists proteger_rol on public.perfiles;
create trigger proteger_rol
  before update on public.perfiles
  for each row execute procedure public.proteger_rol();
