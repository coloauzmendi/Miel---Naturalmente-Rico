"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const preguntas = [
  {
    pregunta: "¿Cómo se conserva y descongela cada producto?",
    respuesta:
      "Los productos congelados viajan conservando la cadena de frío. Guardalos en el freezer y descongelalos en la heladera con anticipación. Los productos cocidos se entregan listos para consumir y conviene conservarlos refrigerados.",
  },
  {
    pregunta: "¿Cuánto tarda la entrega y qué zonas cubren?",
    respuesta:
      "Hacemos entregas en Carcarañá y alrededores. Coordinamos el día y la franja horaria por WhatsApp después de confirmar el pedido. También podés elegir retiro si te resulta más cómodo.",
  },
  {
    pregunta: "¿Qué pasa si no estoy cuando llega el pedido?",
    respuesta:
      "Escribinos ni bien sepas que vas a demorarte. Coordinamos una nueva visita o un punto de retiro para que el pedido llegue en las mejores condiciones.",
  },
  {
    pregunta: "¿Puedo hacer un pedido personalizado?",
    respuesta:
      "Sí. Para cantidades grandes, viandas o necesidades especiales, contactanos por WhatsApp y lo vemos juntas antes de que confirmes la compra.",
  },
];

export default function PreguntasFrecuentes() {
  const [abierta, setAbierta] = useState<number | null>(null);

  return (
    <div className="divide-y divide-linea rounded-2xl border border-linea bg-crema-alta">
      {preguntas.map((item, indice) => {
        const estaAbierta = abierta === indice;
        return (
          <div key={item.pregunta}>
            <button
              type="button"
              onClick={() => setAbierta(estaAbierta ? null : indice)}
              aria-expanded={estaAbierta}
              className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-medium text-tinta sm:px-5"
            >
              {item.pregunta}
              <ChevronDown
                size={18}
                className={`shrink-0 text-marron transition-transform ${estaAbierta ? "rotate-180" : ""}`}
              />
            </button>
            {estaAbierta && (
              <p className="px-4 pb-5 text-sm leading-relaxed text-tinta/70 sm:px-5">
                {item.respuesta}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
