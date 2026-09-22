export default function Marquee() {
  const texto =
    "🚚 Envíos gratis en Carcarañá y alrededores en todos tus pedidos • 🌿 Comida 100% casera y sin conservantes • 📦 Coordinamos la entrega por WhatsApp • ";

  return (
    <div className="w-full overflow-hidden bg-[#2D3B2D]/15 py-2 text-xs font-semibold text-[#2D3B2D]">
      <div className="flex w-max animacion-marquee hover:[animation-play-state:paused]">
        {/* Repetimos el bloque 4 veces para asegurar que llene pantallas ultragrandes */}
        <span className="whitespace-nowrap pr-4">{texto}</span>
        <span className="whitespace-nowrap pr-4">{texto}</span>
        <span className="whitespace-nowrap pr-4" aria-hidden="true">
          {texto}
        </span>
        <span className="whitespace-nowrap pr-4" aria-hidden="true">
          {texto}
        </span>
      </div>
    </div>
  );
}
