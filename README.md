# Miel, naturalmente rico — Tienda online

Tienda online de comida casera cocida y congelada de Sol y Abril:
**https://www.mielnaturalmenterico.com.ar**

Hecha con **Next.js 16**, **Tailwind CSS 4**, **Supabase** (base de datos,
cuentas y fotos), **Mercado Pago** (pagos) y la **API de WhatsApp** (avisos
de pedidos nuevos). Publicada en **Vercel**.

## Qué incluye

- Catálogo con categorías (almuerzos y cenas / desayunos y meriendas),
  buscador, sabores con precio propio y fotos encuadrables desde el panel
- Carrito que se actualiza solo con los precios y el stock reales
- Cuentas de cliente: registro, login, recuperar contraseña e historial
- Checkout con **Mercado Pago** o **efectivo** (se coordina por WhatsApp)
- Webhook de Mercado Pago que marca los pedidos como pagados
- Aviso por WhatsApp a la tienda de cada pedido nuevo (cuando Meta aprueba
  la plantilla) y botón para que el cliente mande su pedido por WhatsApp
- Panel de administración en `/admin` (o el botón en "Mi cuenta" si sos
  admin): resumen, productos y pedidos
- SEO: sitemap, robots, títulos por página, Google Analytics y Search Console
- Seguridad en la base (Row Level Security): cada cliente ve solo lo suyo,
  los precios se calculan en el servidor y nadie puede hacerse admin solo

## Variables de entorno

Van en `.env.local` (para probar en la compu) y en Vercel → Settings →
Environment Variables (para el sitio publicado). Nunca se suben al repo.

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (⚠️ secreta) |
| `MERCADOPAGO_ACCESS_TOKEN` | Mercado Pago Developers → credenciales de producción (⚠️ secreta) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.mielnaturalmenterico.com.ar` |
| `WHATSAPP_TOKEN` | Token permanente del usuario del sistema de Meta (⚠️ secreta) |
| `WHATSAPP_PHONE_NUMBER_ID` | ID del número que envía los avisos |
| `WHATSAPP_AVISO_DESTINOS` | Números que reciben los avisos, separados por coma. Para Argentina, Meta los pide con el 15 y sin el 9: `54` + característica + `15` + número (ej: `54341156149016`) |
| `WHATSAPP_PLANTILLA` | Opcional: `nuevo_pedido` (por defecto, con botón) o `aviso_pedido` |

Si faltan las de WhatsApp, simplemente no se mandan avisos. El número de
WhatsApp de la tienda, el mail y el Instagram están en `src/lib/contacto.ts`
y `src/components/Footer.tsx`; los códigos de Google, en `src/lib/sitio.ts`.

## Probar en la compu

Necesitás [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install
npm run dev
```

Y abrí http://localhost:3000.

## Base de datos (Supabase)

- `supabase/schema.sql`: el esquema completo, para crear una base nueva
  desde cero (SQL Editor → New query → pegar y ejecutar).
- `supabase/migraciones/`: los cambios que se fueron haciendo, en orden de
  fecha. Si la base ya existía, se ejecutan solo los que falten.

### Hacer administradora a alguien

La persona se registra primero como cliente en `/cuenta/registro`. Después,
en Supabase → SQL Editor:

```sql
update public.perfiles set rol = 'admin'
where id = (select id from auth.users where email = 'mail@ejemplo.com');
```

## Publicar cambios

Cada `git push` a `main` publica solo en Vercel:

```bash
git add .
git commit -m "Qué cambié"
git push
```

## Estructura

```
src/
  app/                 → páginas y rutas
    admin/             → panel de administración
    cuenta/            → login, registro, contraseña e historial
    checkout/          → compra, éxito y error
    productos/         → catálogo y detalle de producto
    api/               → checkout, webhook de Mercado Pago y API del panel
    wa/[numero]/       → redirección al chat de WhatsApp (botón del aviso)
  components/          → piezas de la interfaz
  lib/                 → Supabase, avisos, formato, contacto, SEO
  proxy.ts             → sesión y protección de /admin y /cuenta/pedidos
supabase/              → esquema y migraciones de la base
```
