import { MessageCircle, MapPin } from "lucide-react";

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
          <p className="mt-1 text-sm text-crema-alta/80">naturalmente rico</p>
          <p className="mt-4 max-w-xs text-sm text-crema-alta/80">
            Comida casera cocida y congelada, sin conservantes ni aditivos.
            Hecha por Sol y Abril.
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-medium">Contacto</p>
          <a
            href="https://wa.me/5493410000000"
            className="mb-2 flex items-center gap-2 text-crema-alta/80 hover:text-crema-alta"
          >
            <MessageCircle size={16} /> WhatsApp: 341 000-0000
          </a>
          <a
            href="https://instagram.com"
            className="mb-2 flex items-center gap-2 text-crema-alta/80 hover:text-crema-alta"
          >
            <IconoInstagram size={16} /> @miel.naturalmenterico
          </a>
          <p className="flex items-center gap-2 text-crema-alta/80">
            <MapPin size={16} /> Retiro y envíos en Rosario y alrededores
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-medium">Horarios de pedidos</p>
          <p className="text-crema-alta/80">Lunes a viernes, 9 a 18 hs</p>
          <p className="text-crema-alta/80">
            Entregas: martes, jueves y sábados
          </p>
        </div>
      </div>
      <div className="border-t border-crema-alta/15 px-5 py-4 text-center text-xs text-crema-alta/60">
        © {new Date().getFullYear()} Miel, naturalmente rico. Hecho con cariño
        en Rosario.
      </div>
    </footer>
  );
}
