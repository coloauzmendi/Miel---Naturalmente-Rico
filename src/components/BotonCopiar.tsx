"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// Copia un texto (ej: el alias) con un toque y muestra "Copiado".
export default function BotonCopiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso para el portapapeles: el alias igual está a la vista.
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-oliva px-3 py-1.5 text-xs font-medium text-oliva transition-colors hover:bg-oliva hover:text-crema-alta"
    >
      {copiado ? <Check size={14} /> : <Copy size={14} />}
      {copiado ? "Copiado" : "Copiar"}
    </button>
  );
}
