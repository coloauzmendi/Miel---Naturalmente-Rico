import { MessageCircle, MapPin, Mail } from "lucide-react";
import {
  EMAIL_TIENDA,
  linkWhatsapp,
  WHATSAPP_TIENDA_VISIBLE,
} from "@/lib/contacto";

const INSTAGRAM_URL = "https://instagram.com/miel.naturalmenterico/";

function IconoInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="contacto" className="mt-24 bg-marron text-crema-alta">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Miel</p>
          <p className="mt-1 align-middle text-[0.6rem] font-sans font-medium uppercase tracking-[0.18em] text-dorado">
            naturalmente rico
          </p>
          <p className="mt-4 max-w-xs text-sm text-crema-alta/80">
            Comida casera cocida y congelada, sin conservantes ni aditivos.
            Hecha por Sol y Abril.
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-medium">Contacto</p>
          <a
            href={linkWhatsapp()}
            className="mb-2 flex items-center gap-2 text-crema-alta/80 hover:text-crema-alta"
          >
            <MessageCircle size={16} /> WhatsApp: {WHATSAPP_TIENDA_VISIBLE}
          </a>
          <a
            href={INSTAGRAM_URL}
            className="mb-2 flex items-center gap-2 text-crema-alta/80 hover:text-crema-alta"
          >
            <IconoInstagram size={16} /> @miel.naturalmenterico
          </a>
          <a
            href={`mailto:${EMAIL_TIENDA}`}
            className="mb-2 flex items-center gap-2 break-all text-crema-alta/80 hover:text-crema-alta"
          >
            <Mail size={16} className="shrink-0" /> {EMAIL_TIENDA}
          </a>
          <p className="flex items-center gap-2 text-crema-alta/80">
            <MapPin size={16} /> Retiro y envíos en Carcaraña y alrededores
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-medium">Seguinos</p>
          <p className="max-w-xs text-crema-alta/80">
            Mirá lo que cocinamos día a día, enterate de todas las novedades y recetas en nuestro
            Instagram.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-crema-alta px-5 py-2.5 font-medium text-marron transition-colors hover:bg-white"
          >
            <IconoInstagram size={18} /> Seguinos en Instagram
          </a>
        </div>
      </div>
      <div className="border-t border-crema-alta/15 px-5 py-4 text-center text-xs text-crema-alta/60">
        © {new Date().getFullYear()} Miel, naturalmente rico. Hecho con cariño.
      </div>
    </footer>
  );
}
