# Miel, naturalmente rico — Tienda online

Tienda online para el emprendimiento de alimentos cocidos y congelados de
Sol y Abril. Hecha con **Next.js**, **Tailwind CSS**, **Supabase**
(base de datos + cuentas de usuario) y **Mercado Pago** (pagos).

## Qué incluye

- Catálogo de productos con filtro por categoría (cocidos / congelados)
- Carrito de compras
- Cuentas de usuario (registro / login) con historial de pedidos
- Checkout integrado con Mercado Pago
- Webhook que confirma el pago automáticamente y actualiza el pedido
- Panel de administración (`/admin`) para cargar productos y gestionar pedidos
- Seguridad a nivel de base de datos (Row Level Security): cada cliente
  solo puede ver sus propios pedidos; solo los admins pueden editar productos

**Modo demo**: si todavía no configuraste Supabase, la tienda igual se
puede navegar con 6 productos de ejemplo, para que puedas ver el diseño
antes de conectar todo.

## 1. Instalación local

Necesitás [Node.js](https://nodejs.org) 20 o superior instalado.

```bash
npm install
npm run dev
```

Abrí http://localhost:3000 — vas a ver la tienda funcionando en modo demo.

## 2. Conectar Supabase (base de datos + cuentas)

1. Creá una cuenta gratis en [supabase.com](https://supabase.com) y un
   proyecto nuevo.
2. En tu proyecto, andá a **SQL Editor** → **New query**, pegá todo el
   contenido de `supabase/schema.sql` de este repo, y ejecutalo. Esto crea
   las tablas de productos, pedidos y perfiles, con las reglas de
   seguridad ya configuradas.
3. Andá a **Project Settings → API** y copiá:
   - `Project URL` → pegalo en `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → pegalo en `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → pegalo en `SUPABASE_SERVICE_ROLE_KEY`
     (⚠️ esta clave es secreta, nunca la subas a un repo público ni la
     pongas en código del navegador)
4. Copiá `.env.example` como `.env.local` y completá esos tres valores.

### Convertir a Sol o Abril en administradoras

Una de ustedes tiene que **registrarse primero como cliente normal** en
`/cuenta/registro`. Después, en Supabase → **SQL Editor**, ejecutá
(reemplazando el email):

```sql
update public.perfiles set rol = 'admin'
where id = (select id from auth.users where email = 'sol@ejemplo.com');
```

Con eso ya va a poder entrar a `/admin` y cargar los productos reales
(sacando los de ejemplo, que solo se muestran cuando no hay productos
cargados en la base).

## 3. Conectar Mercado Pago

1. Entrá a tu cuenta de [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/panel)
2. Creá una aplicación y andá a **Credenciales de producción** (o de
   prueba, para probar sin cobrar de verdad)
3. Copiá el **Access Token** y pegalo en `MERCADOPAGO_ACCESS_TOKEN` en tu `.env.local`
4. Cuando despliegues a producción, actualizá también
   `NEXT_PUBLIC_SITE_URL` con tu dominio real (por ejemplo
   `https://mielrico.com.ar`) — Mercado Pago lo necesita para saber a
   dónde devolver al cliente después de pagar.

Mientras `MERCADOPAGO_ACCESS_TOKEN` no esté configurado, el botón de
pago simula una compra exitosa para que puedas probar el flujo completo.

## 4. Subir el proyecto a GitHub

```bash
git init
git add .
git commit -m "Primera versión de la tienda Miel"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/miel-tienda.git
git push -u origin main
```

(`.env.local` no se sube nunca, ya está en `.gitignore` — tus claves
quedan seguras.)

## 5. Desplegar en Vercel (gratis)

1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión con tu cuenta
   de GitHub.
2. "Add New Project" → elegí el repositorio `miel-tienda`.
3. En "Environment Variables" cargá las mismas variables de tu
   `.env.local` (las 4 de Supabase/Mercado Pago + `NEXT_PUBLIC_SITE_URL`
   con la URL que Vercel te va a asignar, o tu dominio propio).
4. Deploy. En un par de minutos vas a tener la tienda online.

## 6. Comprar y conectar tu dominio

Comprá el dominio donde prefieras (Namecheap, DonWeb, NIC Argentina para
`.com.ar`, etc.) y en Vercel andá a **Settings → Domains** para
conectarlo. Vercel te va a decir exactamente qué registros DNS agregar
en el panel de tu proveedor de dominio.

## Estructura del proyecto

```
src/
  app/                 → páginas y rutas (App Router de Next.js)
    admin/             → panel de administración
    cuenta/            → login, registro, historial de pedidos
    checkout/          → flujo de pago
    productos/[id]/    → detalle de producto
    api/               → endpoints del servidor (checkout, webhook, admin)
  components/          → componentes de React reutilizables
  lib/                 → helpers (Supabase, formato de precios, productos)
  types/               → tipos de TypeScript compartidos
supabase/
  schema.sql           → esquema completo de la base de datos
```

## Próximos pasos posibles

- Subir fotos reales de los productos (podés usar Supabase Storage o
  simplemente pegar una URL de imagen en el panel de admin)
- Agregar envío de emails de confirmación (Resend, por ejemplo)
- Sumar zona de envío con costo automático según el barrio
