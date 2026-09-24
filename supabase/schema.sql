-- =========================================================
-- Esquema de base de datos para "Miel, naturalmente rico"
-- Ejecutar completo en: Supabase > SQL Editor > New query
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- Tabla: perfiles (extiende auth.users con nombre/rol)
-- ---------------------------------------------------------
create table if not exists public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null default '',
  telefono text,
  rol text not null default 'cliente' check (rol in ('cliente', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.perfiles enable row level security;

create policy "Los usuarios ven su propio perfil"
  on public.perfiles for select
  using (auth.uid() = id);

create policy "Los usuarios actualizan su propio perfil"
  on public.perfiles for update
  using (auth.uid() = id);

-- Crea el perfil automáticamente cuando alguien se registra
create or replace function public.manejar_nuevo_usuario()
returns trigger as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nombre', ''));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.manejar_nuevo_usuario();

-- ---------------------------------------------------------
-- Tabla: productos
-- ---------------------------------------------------------
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text not null default '',
  precio integer not null check (precio >= 0),
  categoria text not null check (categoria in ('almuerzos-cenas', 'desayunos-meriendas')),
  imagen_url text,
  -- Todas las fotos del producto, en orden. imagen_url queda como la
  -- portada (la primera) para lo que todavía la use.
  imagenes text[],
  stock integer not null default 0,
  activo boolean not null default true,
  destacado boolean not null default false,
  -- Variantes que el cliente elige antes de comprar (ej: sabores). null o
  -- lista vacía significa que el producto no tiene variantes.
  sabores text[],
  created_at timestamptz not null default now()
);

alter table public.productos enable row level security;

create policy "Cualquiera puede ver productos activos"
  on public.productos for select
  using (activo = true);

create policy "Los admins ven todos los productos"
  on public.productos for select
  using (
    exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin')
  );

create policy "Los admins crean productos"
  on public.productos for insert
  with check (
    exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin')
  );

create policy "Los admins actualizan productos"
  on public.productos for update
  using (
    exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin')
  );

create policy "Los admins eliminan productos"
  on public.productos for delete
  using (
    exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin')
  );

-- ---------------------------------------------------------
-- Tabla: pedidos
-- ---------------------------------------------------------
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  estado text not null default 'pendiente_pago' check (
    estado in ('pendiente_pago', 'pagado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado')
  ),
  total integer not null check (total >= 0),
  direccion_entrega text not null,
  telefono_contacto text not null,
  notas text,
  mp_preference_id text,
  mp_payment_id text,
  metodo_pago text not null default 'mercadopago' check (
    metodo_pago in ('mercadopago', 'efectivo')
  ),
  created_at timestamptz not null default now()
);

alter table public.pedidos enable row level security;

create policy "Los usuarios ven sus propios pedidos"
  on public.pedidos for select
  using (auth.uid() = user_id);

create policy "Los usuarios crean sus propios pedidos"
  on public.pedidos for insert
  with check (auth.uid() = user_id);

create policy "Los admins ven todos los pedidos"
  on public.pedidos for select
  using (
    exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin')
  );

create policy "Los admins actualizan pedidos"
  on public.pedidos for update
  using (
    exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin')
  );

-- ---------------------------------------------------------
-- Tabla: pedido_items
-- ---------------------------------------------------------
create table if not exists public.pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos (id) on delete cascade,
  producto_id uuid not null,
  nombre_producto text not null,
  precio_unitario integer not null check (precio_unitario >= 0),
  cantidad integer not null check (cantidad > 0),
  -- Variante elegida por el cliente (ej: "Acelga"), si el producto tenía.
  sabor text
);

alter table public.pedido_items enable row level security;

create policy "Los usuarios ven items de sus propios pedidos"
  on public.pedido_items for select
  using (
    exists (
      select 1 from public.pedidos
      where pedidos.id = pedido_items.pedido_id and pedidos.user_id = auth.uid()
    )
  );

create policy "Los usuarios crean items en sus propios pedidos"
  on public.pedido_items for insert
  with check (
    exists (
      select 1 from public.pedidos
      where pedidos.id = pedido_items.pedido_id and pedidos.user_id = auth.uid()
    )
  );

create policy "Los admins ven todos los items"
  on public.pedido_items for select
  using (
    exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin')
  );

-- ---------------------------------------------------------
-- Para convertir tu primer usuario administrador (Sol o Abril),
-- ejecutá esto DESPUÉS de que esa persona se registre en la tienda,
-- reemplazando el email:
-- ---------------------------------------------------------
-- update public.perfiles set rol = 'admin'
-- where id = (select id from auth.users where email = 'sol@ejemplo.com');
